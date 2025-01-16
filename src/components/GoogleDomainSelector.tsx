import React from 'react';
import { Globe2 } from 'lucide-react';
import type { GoogleDomain } from '../types';

interface GoogleDomainSelectorProps {
  selectedDomain: GoogleDomain;
  onSelect: (domain: GoogleDomain) => void;
}

const domains: GoogleDomain[] = ['.com', '.com.au', '.co.nz', '.co.uk', '.ca', '.de'];

export function GoogleDomainSelector({ selectedDomain, onSelect }: GoogleDomainSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <Globe2 className="w-4 h-4 text-gray-400" />
      <select
        value={selectedDomain}
        onChange={(e) => onSelect(e.target.value as GoogleDomain)}
        className="form-select rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
      >
        {domains.map((domain) => (
          <option key={domain} value={domain}>
            Google{domain}
          </option>
        ))}
      </select>
    </div>
  );
}