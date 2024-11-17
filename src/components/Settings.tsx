import React from 'react';
import { useInvestment } from '../context/InvestmentContext';

export const Settings: React.FC = () => {
  const { investmentAmount, setInvestmentAmount } = useInvestment();

  return (
    <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex-1">
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
          Investment Amount ($)
        </label>
        <input
          type="number"
          min="1"
          step="1"
          value={investmentAmount}
          onChange={(e) => setInvestmentAmount(Math.max(1, parseInt(e.target.value) || 0))}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
    </div>
  );
}; 