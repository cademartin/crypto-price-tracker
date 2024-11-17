import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp } from 'lucide-react';
import type { CryptoData } from '../types/crypto';
import { ArbitrageInfo } from './ArbitrageInfo';

interface PriceCardProps {
  crypto: CryptoData;
}

export const PriceCard: React.FC<PriceCardProps> = ({ crypto }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format price with appropriate decimal places
  const formatPrice = (price: number) => {
    if (price < 1) {
      return price.toFixed(8); // Show 8 decimals for small prices
    } else if (price < 100) {
      return price.toFixed(4); // Show 4 decimals for medium prices
    }
    return price.toFixed(2); // Show 2 decimals for large prices
  };

  // Format percentage with color and sign
  const formatPercentage = (percentage: number) => {
    const formattedValue = percentage?.toFixed(2);
    const isPositive = percentage > 0;
    return {
      value: `${isPositive ? '+' : ''}${formattedValue}%`,
      className: `flex items-center ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`
    };
  };

  // Format volume with K/M/B suffix
  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toFixed(2)}`;
  };

  const priceChange = formatPercentage(crypto.price_change_percentage_24h);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between cursor-pointer" 
           onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center space-x-3">
          <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
          <div>
            <h3 className="font-semibold">{crypto.name}</h3>
            <span className="text-gray-500 text-sm uppercase">{crypto.symbol}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-bold">${formatPrice(crypto.current_price)}</div>
          <div className={priceChange.className}>
            {priceChange.value}
            {crypto.price_change_percentage_24h > 0 ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}
          </div>
        </div>
        
        {isExpanded ? (
          <ChevronUp className="ml-2" size={20} />
        ) : (
          <ChevronDown className="ml-2" size={20} />
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Market Cap</span>
              <div className="font-medium">{formatVolume(crypto.market_cap)}</div>
            </div>
            <div>
              <span className="text-gray-500">24h Volume</span>
              <div className="font-medium">{formatVolume(crypto.total_volume)}</div>
            </div>
          </div>
          <ArbitrageInfo arbitrage={crypto.arbitrage} />
        </div>
      )}
    </div>
  );
};