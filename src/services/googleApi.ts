import type { AnalysisResult } from '../types';
import { getUserSettings } from './settings';

interface GoogleSearchResult {
  queries: {
    request: Array<{
      totalResults: string;
    }>;
  };
  items: Array<{
    link: string;
    title: string;
    snippet: string;
  }>;
}

interface PageSpeedResult {
  lighthouseResult: {
    categories: {
      performance: { score: number };
      accessibility: { score: number };
      seo: { score: number };
    };
    audits: {
      'first-contentful-paint': { numericValue: number };
      'largest-contentful-paint': { numericValue: number };
      'cumulative-layout-shift': { numericValue: number };
      'first-input-delay': { numericValue: number };
    };
  };
}

export async function searchBusinesses(keyword: string, domain: string, userId: string): Promise<GoogleSearchResult> {
  const settings = await getUserSettings(userId);

  if (!settings?.google_api_key || !settings?.search_engine_id) {
    throw new Error('Google API configuration is missing. Please add your API keys in Settings.');
  }

  const domainCode = domain.replace(/^\./, '').replace(/\./g, '');

  // Google Custom Search API only returns 10 results per query
  // We need to make multiple requests with different start indices to get 50 results
  const results: GoogleSearchResult = {
    queries: { request: [] },
    items: []
  };
  
  // Make 5 requests for 10 results each
  for (let startIndex = 1; startIndex <= 41; startIndex += 10) {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${settings.google_api_key}` +
      `&cx=${settings.search_engine_id}` +
      `&q=${encodeURIComponent(keyword)}` +
      `&gl=${domainCode}` +
      `&start=${startIndex}` +
      `&num=10`
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch search results');
    }
    
    const data = await response.json();
    
    if (!data.items) {
      throw new Error('No results found. Please try a different search term.');
    }
    
    results.queries.request = [...results.queries.request, ...data.queries.request];
    results.items = [...results.items, ...data.items];
  }
  
  return results;
}

export async function getLighthouseMetrics(url: string, userId: string): Promise<PageSpeedResult> {
  const settings = await getUserSettings(userId);

  if (!settings?.google_api_key) {
    throw new Error('Google API configuration is missing. Please add your API key in Settings.');
  }

  const response = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${settings.google_api_key}&strategy=mobile`
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch Lighthouse metrics');
  }
  
  return response.json();
}

export async function checkWordPress(url: string): Promise<boolean> {
  const response = await fetch('/api/check-wordpress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to check WordPress status');
  }
  
  const { isWordPress } = await response.json();
  return isWordPress;
}