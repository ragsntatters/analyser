import React, { useState, useCallback, useEffect } from 'react';
import { LogIn } from 'lucide-react';
import { signOut } from './services/auth';
import { SearchBar } from './components/SearchBar';
import { GoogleDomainSelector } from './components/GoogleDomainSelector';
import { ProgressBar } from './components/ProgressBar';
import { ResultsTable } from './components/ResultsTable';
import { StatsCards } from './components/StatsCards';
import { PageSpeedReport } from './components/PageSpeedReport';
import { ErrorMessage } from './components/ErrorMessage';
import { Navigation } from './components/Navigation';
import { PastAnalyses } from './components/PastAnalyses';
import { AuthModal } from './components/AuthModal';
import { Settings } from './components/Settings';
import { getCurrentUser } from './services/auth';
import { saveAnalysis, getAnalyses, deleteAnalysis } from './services/analyses';
import { saveLead, getLeads, deleteLead } from './services/leads';
import { supabase } from './services/supabase';
import { searchBusinesses, getLighthouseMetrics, checkWordPress } from './services/googleApi';
import type { AnalysisProgress, AnalysisResult, AnalysisStats, DetailedPageSpeedReport, GoogleDomain, SavedAnalysis } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<'analyze' | 'history' | 'leads' | 'settings'>('analyze');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [savedLeads, setSavedLeads] = useState<Set<string>>(new Set());
  const [keyword, setKeyword] = useState<string>('');
  const [googleDomain, setGoogleDomain] = useState<GoogleDomain>('.com');
  const [selectedResult, setSelectedResult] = useState<DetailedPageSpeedReport | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress>({
    status: 'idle',
    progress: 0,
  });
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Initialize Supabase auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsLoggedIn(true);
        setUser(session?.user || null);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  // Initial mock results for demonstration
  const mockResults: AnalysisResult[] = Array.from({ length: 50 }, (_, i) => ({
    url: `https://example${i}.com`,
    businessName: `Business ${i + 1}`,
    rank: i + 1,
    pageLoadTime: Math.random() * 5 + 0.5,
    lcp: Math.random() * 4 + 0.5,
    cls: Math.random() * 0.5,
    fid: Math.floor(Math.random() * 300),
    performance: Math.random(),
    seo: Math.random(),
    accessibility: Math.random(),
    isWordPress: Math.random() > 0.5,
    status: Math.random() > 0.9 ? 'error' : 'success',
    errorMessage: Math.random() > 0.9 ? 'Connection timeout' : undefined,
  }));

  // Simulated API call - replace with actual API integration
  const analyzeWebsites = useCallback(async (keyword: string) => {
    setError(null);
    setProgress({ status: 'analyzing', progress: 0 });
    
    if (!user?.id) {
      setError('Please sign in to analyze websites');
      setProgress({ status: 'error', progress: 0, error: 'Authentication required' });
      setShowAuthModal(true);
      return;
    }

    try {
      setKeyword(keyword);
      
      // Get search results
      const searchResults = await searchBusinesses(keyword, googleDomain, user.id);
      const totalResults = Math.min(searchResults.items.length, 50);
      
      const analyzedResults: AnalysisResult[] = [];
      
      // Analyze each result
      for (let i = 0; i < totalResults; i++) {
        const result = searchResults.items[i];
        
        setProgress({
          status: 'analyzing',
          progress: (i / totalResults) * 100,
          currentUrl: result.link,
        });

        try {
          // Get Lighthouse metrics
          const metrics = await getLighthouseMetrics(result.link, user.id);
          
          // Check if site uses WordPress
          const isWordPress = await checkWordPress(result.link);
          
          analyzedResults.push({
            url: result.link,
            businessName: result.title,
            rank: i + 1,
            pageLoadTime: metrics.lighthouseResult.audits['first-contentful-paint'].numericValue / 1000,
            lcp: metrics.lighthouseResult.audits['largest-contentful-paint'].numericValue / 1000,
            cls: metrics.lighthouseResult.audits['cumulative-layout-shift'].numericValue,
            fid: metrics.lighthouseResult.audits['first-input-delay'].numericValue,
            performance: metrics.lighthouseResult.categories.performance.score,
            seo: metrics.lighthouseResult.categories.seo.score,
            accessibility: metrics.lighthouseResult.categories.accessibility.score,
            isWordPress,
            status: 'success'
          });
        } catch (err) {
          analyzedResults.push({
            url: result.link,
            businessName: result.title,
            rank: i + 1,
            pageLoadTime: 0,
            lcp: 0,
            cls: 0,
            fid: 0,
            performance: 0,
            seo: 0,
            accessibility: 0,
            isWordPress: false,
            status: 'error',
            errorMessage: err instanceof Error ? err.message : 'Analysis failed'
          });
        }
      }
      
      setResults(analyzedResults);
      setProgress({ status: 'completed', progress: 100 });
      
      // Save the analysis
      try {
        await saveAnalysis(user.id, keyword, googleDomain, analyzedResults);
        // Refresh saved analyses list
        const analyses = await getAnalyses(user.id);
        setSavedAnalyses(analyses);
      } catch (err) {
        console.error('Failed to save analysis:', err);
        setMessage({ type: 'error', text: 'Analysis completed but failed to save. Please try again.' });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze websites';
      setError(errorMessage);
      setProgress({ status: 'error', progress: 0, error: errorMessage });
      
      // If it's an API key error, redirect to settings
      if (errorMessage.includes('API')) {
        setCurrentPage('settings');
      }
    }
  }, [user?.id, googleDomain]);

  const handleExport = (format: 'csv' | 'json') => {
    const data = format === 'csv'
      ? 'data:text/csv;charset=utf-8,' + encodeURIComponent(
          'URL,Business Name,Load Time,WordPress,Status\n' +
          results.map(r => 
            `${r.url},${r.businessName},${r.pageLoadTime},${r.isWordPress},${r.status}`
          ).join('\n')
        )
      : 'data:application/json;charset=utf-8,' + encodeURIComponent(
          JSON.stringify(results, null, 2)
        );

    const link = document.createElement('a');
    link.href = data;
    link.download = `analysis-results.${format}`;
    link.click();
  };

  const stats: AnalysisStats = {
    totalSites: results.length,
    averageLoadTime: results.reduce((acc, r) => acc + r.pageLoadTime, 0) / results.length || 0,
    wordPressSites: results.filter(r => r.isWordPress).length,
    errorCount: results.filter(r => r.status === 'error').length,
    savedLeads: savedLeads.size,
  };

  const handleViewReport = useCallback((result: AnalysisResult) => {
    // Simulate fetching detailed report
    const detailedReport: DetailedPageSpeedReport = {
      ...result,
      metrics: {
        desktop: {
          performance: Math.random(),
          lcp: Math.random() * 4 + 0.5,
          cls: Math.random() * 0.5,
          fid: Math.floor(Math.random() * 300),
        },
        mobile: {
          performance: Math.random(),
          lcp: Math.random() * 4 + 0.5,
          cls: Math.random() * 0.5,
          fid: Math.floor(Math.random() * 300),
        },
      },
      opportunities: Array.from({ length: 5 }, (_, i) => ({
        title: `Optimization Opportunity ${i + 1}`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        score: Math.random(),
        impact: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
      })),
      diagnostics: Array.from({ length: 4 }, (_, i) => ({
        title: `Diagnostic ${i + 1}`,
        description: 'Technical details about the page performance.',
        value: Math.random() > 0.5 ? `${Math.round(Math.random() * 1000)}ms` : 'Passed',
      })),
      screenshots: {
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80',
        fullpage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      },
    };
    setSelectedResult(detailedReport);
  }, []);

  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      setUser(user);
      setIsLoggedIn(!!user);
      
      if (user) {
        // Load saved analyses and leads
        const analyses = await getAnalyses(user.id);
        setSavedAnalyses(analyses);
        
        const leads = await getLeads(user.id);
        setSavedLeads(new Set(leads.map(lead => lead.url)));
      }
    };
    
    checkUser();
  }, []);

  const handleDeleteAnalysis = (id: string) => {
    if (!user) return;
    
    deleteAnalysis(id).then(() => {
      setSavedAnalyses(prev => prev.filter(analysis => analysis.id !== id));
    });
  };

  const handleLoginClick = () => {
    if (isLoggedIn) {
      signOut();
      window.location.reload(); // Refresh to clear all state
    } else {
      setShowAuthModal(true);
    }
  };

  const handleSelectPastAnalysis = (analysis: SavedAnalysis) => {
    setResults(analysis.results);
    setKeyword(analysis.keyword);
    setGoogleDomain(analysis.domain);
    setProgress({ status: 'completed', progress: 100 });
    setCurrentPage('analyze');
  };

  const handleToggleLead = async (result: AnalysisResult) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setSavedLeads(prev => {
      const newLeads = new Set(prev);
      if (newLeads.has(result.url)) {
        deleteLead(result.url);
        newLeads.delete(result.url);
      } else {
        saveLead(user.id, result);
        newLeads.add(result.url);
      }
      return newLeads;
    });
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    checkUser(); // Reload user data without full page refresh
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLoginClick}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'analyze' && (
          <div className="space-y-8">
          {/* Search Section */}
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Analyze Websites by Keyword
            </h2>
            <p className="text-gray-500 text-center max-w-2xl">
              Enter a keyword to analyze websites. We'll check their performance,
              technology stack, and provide detailed insights.
            </p>
            <div className="w-full max-w-2xl space-y-4">
              <SearchBar
                onSearch={analyzeWebsites}
                isLoading={progress.status === 'analyzing'}
              />
              <div className="flex justify-end">
                <GoogleDomainSelector
                  selectedDomain={googleDomain}
                  onSelect={setGoogleDomain}
                />
              </div>
            </div>
          </div>

          {/* Progress Section */}
          {progress.status === 'analyzing' && (
            <div className="flex justify-center">
              <ProgressBar progress={progress} />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <ErrorMessage
              title="Analysis Failed"
              message={error}
              onRetry={() => analyzeWebsites(keyword)}
            />
          )}

          {/* Results Section */}
          {results.length > 0 && progress.status === 'completed' && (
            <div className="space-y-6">
              {selectedResult ? (
                <PageSpeedReport
                  report={selectedResult}
                  onBack={() => setSelectedResult(null)}
                />
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900">Analysis Results</h3>
                  <StatsCards stats={stats} />
                  <ResultsTable
                    results={results}
                    onExport={handleExport}
                    onViewReport={handleViewReport}
                    savedLeads={savedLeads}
                    onToggleLead={handleToggleLead}
                  />
                </>
              )}
            </div>
          )}
        </div>
        )}
        {currentPage === 'history' && (
          <PastAnalyses
            analyses={savedAnalyses}
            onSelect={handleSelectPastAnalysis}
            onDelete={handleDeleteAnalysis}
          />
        )}
        {currentPage === 'leads' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Saved Leads</h2>
            <ResultsTable
              results={results.filter(r => savedLeads.has(r.url))}
              onExport={handleExport}
              onViewReport={handleViewReport}
              savedLeads={savedLeads}
              onToggleLead={handleToggleLead}
            />
          </div>
        )}
        {currentPage === 'settings' && (
          isLoggedIn ? (
          <Settings userId={user.id} />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in Required</h2>
              <p className="text-gray-600 mb-4">Please sign in to access settings</p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </button>
            </div>
          )
        )}
      </main>
      
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

export default App;
