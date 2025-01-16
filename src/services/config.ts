export const config = {
  // API Keys and endpoints
  googleApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  googleSearchCx: import.meta.env.VITE_GOOGLE_SEARCH_CX,
  
  // API rate limits (per day)
  limits: {
    searchQueries: 100,  // Free tier limit
    pageSpeedQueries: 1000,  // Free tier limit
    maxResultsPerSearch: 50
  },
  
  // Error messages
  errors: {
    rateLimitExceeded: 'Daily API quota exceeded. Please try again tomorrow.',
    searchFailed: 'Failed to fetch search results. Please try again.',
    pageSpeedFailed: 'Failed to analyze page performance. Please try again.',
    wordPressFailed: 'Failed to check WordPress status.'
  }
};