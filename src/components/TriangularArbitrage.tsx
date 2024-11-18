import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import Decimal from 'decimal.js';
import { useInvestment } from '../context/InvestmentContext';
import { TrendingUp, ArrowRight } from 'lucide-react';

interface TriangularPath {
  path: string[];
  profitPercentage: number;
  investment: number;
  finalAmount: number;
  steps: {
    from: string;
    to: string;
    rate: number;
    exchange: string;
    price: number;
  }[];
}

interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  bid: number;
  ask: number;
}

export const TriangularArbitrage: React.FC = () => {
  const { investmentAmount } = useInvestment();
  const [selectedExchange, setSelectedExchange] = useState('binance');

  const { data: opportunities, isLoading, error } = useQuery<TriangularPath[]>(
    ['triangularArbitrage', selectedExchange, investmentAmount],
    async () => {
      const { data } = await axios.get('https://api.binance.com/api/v3/ticker/bookTicker');
      
      const pairs = data.map((ticker: any) => ({
        symbol: ticker.symbol,
        bid: parseFloat(ticker.bidPrice),
        ask: parseFloat(ticker.askPrice)
      }));

      const opportunities = findTriangularOpportunities(pairs, investmentAmount);
      return opportunities.sort((a, b) => b.profitPercentage - a.profitPercentage);
    },
    {
      refetchInterval: 10000,
      staleTime: 5000,
    }
  );

  const exchanges = [
    { value: 'binance', label: 'Binance' },
    { value: 'kucoin', label: 'KuCoin' },
    { value: 'huobi', label: 'Huobi' },
  ];

  const formatPrice = (price: number) => {
    if (price < 0.000001) return price.toExponential(6);
    if (price < 0.001) return price.toFixed(10);
    if (price < 1) return price.toFixed(8);
    if (price < 100) return price.toFixed(6);
    if (price < 10000) return price.toFixed(4);
    return price.toFixed(2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white mb-2">Triangular Arbitrage</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find profitable trading paths within a single exchange
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Exchange
        </label>
        <select
          value={selectedExchange}
          onChange={(e) => setSelectedExchange(e.target.value)}
          className="w-48 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {exchanges.map(exchange => (
            <option key={exchange.value} value={exchange.value}>
              {exchange.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-48" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 dark:text-red-400">
          Error loading arbitrage opportunities. Please try again later.
        </div>
      ) : (
        <div className="grid gap-6">
          {opportunities?.map((opportunity, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
                    <TrendingUp className="text-blue-500" size={20} />
                    Trading Path {index + 1}
                  </h3>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      opportunity.profitPercentage > 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {opportunity.profitPercentage > 0 ? '+' : ''}{opportunity.profitPercentage.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Profit: ${(opportunity.finalAmount - opportunity.investment).toFixed(8)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  {opportunity.path.map((symbol, i) => (
                    <React.Fragment key={i}>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                          {symbol}
                        </div>
                        {i < opportunity.steps.length && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {formatPrice(opportunity.steps[i].price)}
                          </div>
                        )}
                      </div>
                      {i < opportunity.path.length - 1 && (
                        <ArrowRight className="text-gray-400" size={20} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Investment</span>
                    <div className="font-medium dark:text-white text-lg">
                      ${investmentAmount.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Final Amount</span>
                    <div className="font-medium dark:text-white text-lg">
                      ${formatPrice(opportunity.finalAmount)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {opportunity.steps.map((step, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                      <div className="text-gray-600 dark:text-gray-400">
                        {step.from} → {step.to}
                      </div>
                      <div className="font-medium dark:text-white">
                        Rate: {formatPrice(step.rate)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function findTriangularOpportunities(pairs: any[], investment: number): TriangularPath[] {
  const tradingPairs = pairs.map(pair => {
    const symbol = pair.symbol;
    const baseAsset = symbol.replace(/USDT$|BTC$|ETH$|BNB$/, '');
    const quoteAsset = symbol.slice(baseAsset.length);
    
    return {
      symbol: pair.symbol,
      baseAsset,
      quoteAsset,
      bid: parseFloat(pair.bid),
      ask: parseFloat(pair.ask)
    };
  });

  const paths: TriangularPath[] = [];
  const stableCoins = ['USDT', 'USDC', 'BUSD', 'DAI'];
  const tradingFee = 0.001; // 0.1% trading fee

  stableCoins.forEach(stableCoin => {
    const firstPairs = tradingPairs.filter(pair => pair.quoteAsset === stableCoin);

    firstPairs.forEach(firstPair => {
      const secondPairs = tradingPairs.filter(pair => 
        pair.quoteAsset === firstPair.baseAsset
      );

      secondPairs.forEach(secondPair => {
        const thirdPairs = tradingPairs.filter(pair =>
          pair.baseAsset === secondPair.baseAsset &&
          pair.quoteAsset === stableCoin
        );

        thirdPairs.forEach(thirdPair => {
          // Calculate with higher precision
          const amount = new Decimal(investment);
          
          // First trade: USDT -> First Asset
          const firstAmount = amount.dividedBy(new Decimal(firstPair.ask))
            .mul(new Decimal(1).minus(tradingFee));
          
          // Second trade: First Asset -> Second Asset
          const secondAmount = firstAmount.mul(new Decimal(secondPair.bid))
            .mul(new Decimal(1).minus(tradingFee));
          
          // Third trade: Second Asset -> USDT
          const finalAmount = secondAmount.mul(new Decimal(thirdPair.bid))
            .mul(new Decimal(1).minus(tradingFee));
          
          const profit = finalAmount.minus(amount);
          const profitPercentage = profit.dividedBy(amount).mul(100);

          // Only include opportunities with positive profit and sufficient volume
          if (profitPercentage.greaterThan(0)) {
            paths.push({
              path: [
                stableCoin,
                firstPair.baseAsset,
                secondPair.baseAsset,
                stableCoin
              ],
              profitPercentage: profitPercentage.toNumber(),
              investment: amount.toNumber(),
              finalAmount: finalAmount.toNumber(),
              steps: [
                {
                  from: stableCoin,
                  to: firstPair.baseAsset,
                  rate: firstPair.ask,
                  price: firstPair.ask,
                  exchange: 'Binance'
                },
                {
                  from: firstPair.baseAsset,
                  to: secondPair.baseAsset,
                  rate: secondPair.bid,
                  price: secondPair.bid,
                  exchange: 'Binance'
                },
                {
                  from: secondPair.baseAsset,
                  to: stableCoin,
                  rate: thirdPair.bid,
                  price: thirdPair.bid,
                  exchange: 'Binance'
                }
              ]
            });
          }
        });
      });
    });
  });

  return paths.sort((a, b) => b.profitPercentage - a.profitPercentage);
} 