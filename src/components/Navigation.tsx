import React from 'react';
import { Activity, History, LogIn, Search, Star, Settings } from 'lucide-react';

interface NavigationProps {
  currentPage: 'analyze' | 'history' | 'leads' | 'settings';
  onNavigate: (page: 'analyze' | 'history' | 'leads' | 'settings') => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

export function Navigation({ currentPage, onNavigate, isLoggedIn, onLoginClick }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Website Analyzer</span>
            </div>
            <div className="ml-6 flex space-x-8">
              <button
                onClick={() => onNavigate('analyze')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentPage === 'analyze'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Search className="w-4 h-4 mr-2" />
                Analyze
              </button>
              <button
                onClick={() => onNavigate('history')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentPage === 'history'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <History className="w-4 h-4 mr-2" />
                Past Reports
              </button>
              <button
                onClick={() => onNavigate('leads')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentPage === 'leads'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Star className="w-4 h-4 mr-2" />
                Leads
              </button>
              <button
                onClick={() => onNavigate('settings')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentPage === 'settings'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={onLoginClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isLoggedIn ? 'Sign Out' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}