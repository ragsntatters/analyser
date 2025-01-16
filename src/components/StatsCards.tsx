import React from 'react';
import { Clock, Globe, AlertCircle, Box } from 'lucide-react';
import type { AnalysisStats } from '../types';

interface StatsCardsProps {
  stats: AnalysisStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Sites',
      value: stats.totalSites,
      icon: Globe,
      color: 'blue',
    },
    {
      title: 'Avg. Load Time',
      value: `${stats.averageLoadTime.toFixed(2)}s`,
      icon: Clock,
      color: 'green',
    },
    {
      title: 'WordPress Sites',
      value: `${((stats.wordPressSites / stats.totalSites) * 100).toFixed(1)}%`,
      icon: Box,
      color: 'purple',
    },
    {
      title: 'Errors',
      value: stats.errorCount,
      icon: AlertCircle,
      color: 'red',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`p-6 bg-white rounded-lg shadow-lg border-t-4 border-${card.color}-500`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
            <card.icon className={`w-12 h-12 text-${card.color}-500 opacity-20`} />
          </div>
        </div>
      ))}
    </div>
  );
}