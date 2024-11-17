import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Coins } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { PriceCard } from './components/PriceCard';
import { useCryptoData } from './hooks/useCryptoData';
import { ThemeProvider } from './context/ThemeContext';
import { InvestmentProvider } from './context/InvestmentContext';
import { Settings } from './components/Settings';
import { useTheme } from './context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const queryClient = new QueryClient();

function CryptoTracker() {
  const [search, setSearch] = useState('');
  const { data: cryptos, isLoading, error } = useCryptoData(search);
  const { theme, toggleTheme } = useTheme();

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading cryptocurrency data. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'light' ? (
              <Moon className="text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="text-gray-600 dark:text-gray-300" />
            )}
          </button>
          <div className="flex items-center gap-4">
            <Coins size={32} className="text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold dark:text-white">Crypto Price Tracker</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Sorted by highest arbitrage opportunity</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SearchBar search={search} setSearch={setSearch} />
          <div className="min-w-[200px]">
            <Settings />
          </div>
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
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <InvestmentProvider>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
            <CryptoTracker />
          </div>
        </InvestmentProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;