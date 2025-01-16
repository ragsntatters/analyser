export interface AnalysisResult {
  url: string;
  businessName: string;
  rank: number;
  pageLoadTime: number;
  lcp: number;
  cls: number;
  fid: number;
  performance: number;
  seo: number;
  accessibility: number;
  isWordPress: boolean;
  status: 'success' | 'error';
  errorMessage?: string;
}

export interface DetailedPageSpeedReport extends AnalysisResult {
  metrics: {
    desktop: {
      performance: number;
      lcp: number;
      cls: number;
      fid: number;
    };
    mobile: {
      performance: number;
      lcp: number;
      cls: number;
      fid: number;
    };
  };
  opportunities: Array<{
    title: string;
    description: string;
    score: number;
    impact: 'high' | 'medium' | 'low';
  }>;
  diagnostics: Array<{
    title: string;
    description: string;
    value: string | number;
  }>;
  screenshots: {
    thumbnail: string;
    fullpage: string;
  };
}

export type GoogleDomain = '.com' | '.com.au' | '.co.nz' | '.co.uk' | '.ca' | '.de';

export interface AnalysisProgress {
  status: 'idle' | 'analyzing' | 'completed' | 'error';
  progress: number;
  currentUrl?: string;
  error?: string;
}

export interface SavedAnalysis {
  id: string;
  keyword: string;
  date: string;
  domain: GoogleDomain;
  results: AnalysisResult[];
}

export interface AnalysisStats {
  totalSites: number;
  averageLoadTime: number;
  wordPressSites: number;
  errorCount: number;
  savedLeads: number;
}