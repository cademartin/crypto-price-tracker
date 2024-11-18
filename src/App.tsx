import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Coins } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { InvestmentProvider } from './context/InvestmentContext';
import { SidePanel } from './components/SidePanel';
import { TriangularArbitrage } from './components/TriangularArbitrage';
import { CryptoTracker } from './components/CryptoTracker';

const queryClient = new QueryClient();

function Navigation() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <SidePanel />
            <div className="flex items-center gap-4">
              <Coins size={32} className="text-blue-500" />
              <div>
                <h1 className="text-xl font-bold dark:text-white">Crypto Arbitrage</h1>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cross-Exchange
            </Link>
            <Link 
              to="/triangular" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Triangular
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <InvestmentProvider>
          <BrowserRouter basename="/crypto-price-tracker">
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
              <Navigation />
              <Routes>
                <Route path="/" element={<CryptoTracker />} />
                <Route path="/triangular" element={<TriangularArbitrage />} />
              </Routes>
            </div>
          </BrowserRouter>
        </InvestmentProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;