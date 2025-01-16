import React from 'react';
import { ArrowLeft, Zap, Search, Accessibility, Code2, AlertTriangle, Monitor, Smartphone, ExternalLink } from 'lucide-react';
import type { DetailedPageSpeedReport } from '../types';

interface PageSpeedReportProps {
  report: DetailedPageSpeedReport;
  onBack: () => void;
}

export function PageSpeedReport({ report, onBack }: PageSpeedReportProps) {
  const metrics = [
    { name: 'Performance', value: report.performance, icon: Zap, color: 'blue' },
    { name: 'SEO', value: report.seo, icon: Search, color: 'green' },
    { name: 'Accessibility', value: report.accessibility, icon: Accessibility, color: 'purple' },
  ];

  const coreWebVitals = [
    { name: 'LCP', value: `${report.lcp.toFixed(2)}s`, target: '< 2.5s' },
    { name: 'CLS', value: report.cls.toFixed(3), target: '< 0.1' },
    { name: 'FID', value: `${report.fid}ms`, target: '< 100ms' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-lg shadow-lg text-white">
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 text-white hover:text-white/90 bg-white/10 rounded-lg transition-colors backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Results
        </button>
        <div className="text-center flex-1">
          <h2 className="text-3xl font-bold">{report.businessName}</h2>
          <a
            href={report.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 hover:text-white flex items-center justify-center mt-2 text-lg"
          >
            {report.url}
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
        <div className="w-[100px]" /> {/* Spacer for alignment */}
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map(({ name, value, icon: Icon, color }) => (
          <div key={name} className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{name}</p>
                <p className={`mt-2 text-3xl font-bold text-${color}-600`}>
                  {Math.round(value * 100)}%
                </p>
              </div>
              <Icon className={`w-12 h-12 text-${color}-500 opacity-20`} />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Desktop Metrics */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform">
          <div className="flex items-center space-x-2 p-4 bg-gray-50 border-b border-gray-100">
            <Monitor className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Desktop Performance</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Performance Score</span>
              <span className={`text-lg font-medium ${
                report.metrics.desktop.performance >= 0.9 ? 'text-green-600' :
                report.metrics.desktop.performance >= 0.5 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {Math.round(report.metrics.desktop.performance * 100)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">LCP</span>
              <span className={`text-lg font-medium ${
                report.metrics.desktop.lcp <= 2.5 ? 'text-green-600' :
                report.metrics.desktop.lcp <= 4 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {report.metrics.desktop.lcp.toFixed(2)}s
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">CLS</span>
              <span className={`text-lg font-medium ${
                report.metrics.desktop.cls <= 0.1 ? 'text-green-600' :
                report.metrics.desktop.cls <= 0.25 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {report.metrics.desktop.cls.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">FID</span>
              <span className={`text-lg font-medium ${
                report.metrics.desktop.fid <= 100 ? 'text-green-600' :
                report.metrics.desktop.fid <= 300 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {report.metrics.desktop.fid}ms
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Metrics */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform">
          <div className="flex items-center space-x-2 p-4 bg-gray-50 border-b border-gray-100">
            <Smartphone className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Mobile Performance</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Performance Score</span>
              <span className={`text-lg font-medium ${
                report.metrics.mobile.performance >= 0.9 ? 'text-green-600' :
                report.metrics.mobile.performance >= 0.5 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {Math.round(report.metrics.mobile.performance * 100)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">LCP</span>
              <span className={`text-lg font-medium ${
                report.metrics.mobile.lcp <= 2.5 ? 'text-green-600' :
                report.metrics.mobile.lcp <= 4 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {report.metrics.mobile.lcp.toFixed(2)}s
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">CLS</span>
              <span className={`text-lg font-medium ${
                report.metrics.mobile.cls <= 0.1 ? 'text-green-600' :
                report.metrics.mobile.cls <= 0.25 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {report.metrics.mobile.cls.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">FID</span>
              <span className={`text-lg font-medium ${
                report.metrics.mobile.fid <= 100 ? 'text-green-600' :
                report.metrics.mobile.fid <= 300 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {report.metrics.mobile.fid}ms
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-[1.01] transition-transform">
        <h3 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b border-gray-100">Core Web Vitals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreWebVitals.map(({ name, value, target }) => (
            <div key={name} className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-600">{name}</span>
                <span className="text-xs text-gray-400">Target: {target}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {report.screenshots && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Screenshots</h3>
          </div>
          <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img
              src={report.screenshots.thumbnail}
              alt="Page thumbnail"
              className="rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-zoom-in"
            />
            <img
              src={report.screenshots.fullpage}
              alt="Full page screenshot"
              className="rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-zoom-in"
            />
          </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Opportunities</h3>
          </div>
          <div className="p-8">
          <div className="space-y-4">
            {report.opportunities.map((item, index) => (
              <div key={index} className="border-l-4 border-yellow-500 pl-4 py-2 hover:bg-yellow-50 transition-colors">
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <div className="flex items-center mt-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-yellow-500 rounded-full"
                      style={{ width: `${item.score * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    Impact: {item.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Diagnostics</h3>
          </div>
          <div className="p-8">
          <div className="space-y-4">
            {report.diagnostics.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                <Code2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm font-mono mt-1 text-blue-600">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}