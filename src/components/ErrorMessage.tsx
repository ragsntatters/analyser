import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ title, message, onRetry }: ErrorMessageProps) {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border-l-4 border-red-500">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-gray-500">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}