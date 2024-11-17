import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { ArbitrageInfo as ArbitrageInfoType } from '../types/crypto';

interface ArbitrageInfoProps {
  arbitrage: ArbitrageInfoType;
}

export const ArbitrageInfo: React.FC<ArbitrageInfoProps> = ({ arbitrage }) => {
  // Format price with appropriate decimal places
  const formatPrice = (price: number) => {
    if (price < 1) {
      return price.toFixed(8);
    } else if (price < 100) {
      return price.toFixed(4);
    }
    return price.toFixed(2);
  };

  // Format profit with dollar sign and appropriate decimals
  const formatProfit = (profit: number) => {
    const absProfit = Math.abs(profit);
    if (absProfit < 0.01) {
      return `$${profit.toFixed(8)}`;
    } else if (absProfit < 1) {
      return `$${profit.toFixed(4)}`;
    }
    return `$${profit.toFixed(2)}`;
  };

  // Format percentage with color and sign
  const formatPercentage = (percentage: number) => {
    const formattedValue = percentage.toFixed(2);
    const isPositive = percentage > 0;
    return {
      value: `${isPositive ? '+' : ''}${formattedValue}%`,
      className: `font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`
    };
  };

  const profitPercentage = formatPercentage(arbitrage.profitPercentage);

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <h4 className="text-lg font-semibold mb-3 dark:text-white">Arbitrage Opportunity</h4>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="text-sm text-gray-500 dark:text-gray-400">Buy from</div>
          <div className="font-medium dark:text-white">{arbitrage.lowestExchange.exchange}</div>
          <div className="text-sm dark:text-gray-300">${formatPrice(arbitrage.lowestExchange.price)}</div>
        </div>
        
        <ArrowRight className="mx-2 text-gray-400" size={20} />
        
        <div className="flex-1 text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">Sell on</div>
          <div className="font-medium dark:text-white">{arbitrage.highestExchange.exchange}</div>
          <div className="text-sm dark:text-gray-300">${formatPrice(arbitrage.highestExchange.price)}</div>
        </div>
      </div>

      <div className="space-y-2 border-t border-gray-200 dark:border-gray-600 pt-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Potential Profit:</span>
          <span className="font-medium dark:text-white">{formatProfit(arbitrage.potentialProfit)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Price Difference:</span>
          <span className={profitPercentage.className}>{profitPercentage.value}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Profit After Fees:</span>
          <span className={`font-medium ${
            arbitrage.profitAfterFees > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {formatProfit(arbitrage.profitAfterFees)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Trading Fees:</span>
          <span className="dark:text-gray-300">
            {arbitrage.lowestExchange.trading_fee}% / {arbitrage.highestExchange.trading_fee}%
          </span>
        </div>
      </div>
    </div>
  );
};