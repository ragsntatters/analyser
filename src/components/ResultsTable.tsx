import React, { useState } from 'react';
import { Download, Filter, Clock, Globe, Star, ExternalLink } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface ResultsTableProps {
  results: AnalysisResult[];
  onExport: (format: 'csv' | 'json') => void;
  onViewReport: (result: AnalysisResult) => void;
  savedLeads: Set<string>;
  onToggleLead: (result: AnalysisResult) => void;
}

export function ResultsTable({ 
  results, 
  onExport, 
  onViewReport, 
  savedLeads, 
  onToggleLead 
}: ResultsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof AnalysisResult>('pageLoadTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredResults = results.filter(
    (result) =>
      result.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedResults = [...filteredResults].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    return sortDirection === 'asc'
      ? aValue > bValue ? 1 : -1
      : aValue < bValue ? 1 : -1;
  });

  const handleSort = (field: keyof AnalysisResult) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onExport('csv')}
              className="flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={() => onExport('json')}
              className="flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('rank')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Rank
              </th>
              <th
                onClick={() => handleSort('businessName')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Business/URL
                </div>
              </th>
              <th
                onClick={() => handleSort('lcp')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  LCP
                </div>
              </th>
              <th
                onClick={() => handleSort('cls')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                CLS
              </th>
              <th
                onClick={() => handleSort('fid')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                FID
              </th>
              <th
                onClick={() => handleSort('performance')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                WordPress
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Add to Leads
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedResults.map((result) => (
              <tr key={result.url} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    #{result.rank}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onViewReport(result);
                      }}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {result.businessName}
                    </button>
                    <div className="flex items-center mt-1">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {result.url}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <span className={
                      result.lcp <= 2.5 ? 'text-green-800 bg-green-100' :
                      result.lcp <= 4 ? 'text-yellow-800 bg-yellow-100' :
                      'text-red-800 bg-red-100'
                    }>
                      {result.lcp.toFixed(2)}s
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <span className={
                      result.cls <= 0.1 ? 'text-green-800 bg-green-100' :
                      result.cls <= 0.25 ? 'text-yellow-800 bg-yellow-100' :
                      'text-red-800 bg-red-100'
                    }>
                      {result.cls.toFixed(3)}
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <span className={
                      result.fid <= 100 ? 'text-green-800 bg-green-100' :
                      result.fid <= 300 ? 'text-yellow-800 bg-yellow-100' :
                      'text-red-800 bg-red-100'
                    }>
                      {result.fid}ms
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${
                          result.performance >= 0.9
                            ? 'bg-green-500'
                            : result.performance >= 0.5
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${result.performance * 100}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {Math.round(result.performance * 100)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    result.isWordPress
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {result.isWordPress ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLead(result);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      savedLeads.has(result.url)
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    <Star className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}