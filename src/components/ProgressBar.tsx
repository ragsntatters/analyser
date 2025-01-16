import React from 'react';
import { Loader2 } from 'lucide-react';
import type { AnalysisProgress } from '../types';

interface ProgressBarProps {
  progress: AnalysisProgress;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full max-w-2xl">
      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          {progress.status === 'analyzing' ? 'Analyzing websites...' : 'Analysis complete'}
        </span>
        <span className="text-sm text-gray-500">{Math.round(progress.progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress.progress}%` }}
        />
      </div>
      {progress.currentUrl && (
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          <span className="truncate">Currently analyzing: {progress.currentUrl}</span>
        </div>
      )}
      {progress.error && (
        <div className="mt-2 text-sm text-red-600">
          Error: {progress.error}
        </div>
      )}
    </div>
  );
}