import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { PriceCard } from './PriceCard';
import { Settings } from './Settings';
import { useCryptoData } from '../hooks/useCryptoData';

export const CryptoTracker: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data: cryptos, isLoading, error } = useCryptoData(search);

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading cryptocurrency data. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold dark:text-white mb-2">Cross-Exchange Arbitrage</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Find arbitrage opportunities across different exchanges
        </p>
      </div>

      <div className="flex justify-end items-center gap-4 mb-8">
        <SearchBar search={search} setSearch={setSearch} />
        <div className="min-w-[200px]">
          <Settings />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-64" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cryptos?.map((crypto) => (
            <PriceCard key={crypto.id} crypto={crypto} />
          ))}
        </div>
      )}
    </div>
  );
}; 