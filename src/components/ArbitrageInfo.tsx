import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { ArbitrageInfo as ArbitrageInfoType } from '../types/crypto';

interface ArbitrageInfoProps {
  arbitrage: ArbitrageInfoType;
}

export const ArbitrageInfo: React.FC<ArbitrageInfoProps> = ({ arbitrage }) => {
  const isArbitrageProfitable = arbitrage.profitAfterFees > 0;

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-semibold text-gray-700 mb-2">Arbitrage Opportunity</h4>
      
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 text-sm">
          <p className="text-gray-600">{arbitrage.lowestExchange.exchange}</p>
          <p className="font-medium">${arbitrage.lowestExchange.price.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Fee: {arbitrage.lowestExchange.trading_fee}%</p>
        </div>
        
        <ArrowRight className="text-gray-400" size={20} />
        
        <div className="flex-1 text-sm text-right">
          <p className="text-gray-600">{arbitrage.highestExchange.exchange}</p>
          <p className="font-medium">${arbitrage.highestExchange.price.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Fee: {arbitrage.highestExchange.trading_fee}%</p>
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Spread:</span>
          <span className="font-medium">{arbitrage.profitPercentage.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Potential Profit:</span>
          <span className="font-medium">${arbitrage.potentialProfit.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Profit After Fees:</span>
          <span className={`font-medium ${isArbitrageProfitable ? 'text-green-500' : 'text-red-500'}`}>
            ${arbitrage.profitAfterFees.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}