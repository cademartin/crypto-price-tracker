import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp } from 'lucide-react';
import type { CryptoData } from '../types/crypto';
import { ArbitrageInfo } from './ArbitrageInfo';

interface PriceCardProps {
  crypto: CryptoData;
}

export const PriceCard: React.FC<PriceCardProps> = ({ crypto }) => {
  const [showAllExchanges, setShowAllExchanges] = useState(false);
  const isPriceUp = crypto.price_change_percentage_24h > 0;
  
  const displayedExchanges = showAllExchanges 
    ? crypto.exchanges 
    : crypto.exchanges.slice(0, 4);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <img src={crypto.image} alt={crypto.name} className="w-12 h-12" />
        <div>
          <h3 className="text-xl font-bold">{crypto.name}</h3>
          <p className="text-gray-500 uppercase">{crypto.symbol}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-3xl font-bold">${crypto.current_price.toLocaleString()}</p>
        <div className={`flex items-center ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
          {isPriceUp ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
          <span className="font-semibold">
            {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-gray-700">Exchange Prices</h4>
        {displayedExchanges.map((exchange) => (
          <div key={exchange.exchange} className="flex justify-between items-center">
            <span className="text-gray-600">{exchange.exchange}</span>
            <span className="font-medium">${exchange.price.toLocaleString()}</span>
          </div>
        ))}
        
        {crypto.exchanges.length > 4 && (
          <button
            onClick={() => setShowAllExchanges(!showAllExchanges)}
            className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 transition-colors w-full justify-center mt-2"
          >
            {showAllExchanges ? (
              <>Show Less <ChevronUp size={16} /></>
            ) : (
              <>Show More <ChevronDown size={16} /></>
            )}
          </button>
        )}
      </div>

      <ArbitrageInfo arbitrage={crypto.arbitrage} />
    </div>
  );
}