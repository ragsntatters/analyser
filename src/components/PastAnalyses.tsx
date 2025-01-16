import React from 'react';
import { Calendar, Search, Trash2 } from 'lucide-react';
import type { SavedAnalysis } from '../types';

interface PastAnalysesProps {
  analyses: SavedAnalysis[];
  onSelect: (analysis: SavedAnalysis) => void;
  onDelete: (id: string) => void;
}

export function PastAnalyses({ analyses, onSelect, onDelete }: PastAnalysesProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Past Analyses</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {analyses.map((analysis) => (
          <div
            key={analysis.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => onSelect(analysis)}
          >
            <div className="p-6 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(analysis.id);
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete analysis"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <Search className="w-5 h-5 text-blue-600" />
                  <h3 className="ml-2 text-lg font-medium text-gray-900">
                    {analysis.keyword}
                  </h3>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Google{analysis.domain}
                </span>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(analysis.date).toLocaleDateString()}
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <span>Results: {analysis.results.length}</span>
                <span>
                  Avg. Performance:{' '}
                  {Math.round(
                    (analysis.results.reduce((acc, r) => acc + r.performance, 0) /
                      analysis.results.length) *
                      100
                  )}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}