import { useQuery } from 'react-query';
import axios from 'axios';
import type { CryptoData, ExchangePrice } from '../types/crypto';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const EXCHANGES = [
  { name: 'Binance', fee: 0.1 },
  { name: 'Coinbase', fee: 0.6 },
  { name: 'Kraken', fee: 0.26 },
  { name: 'KuCoin', fee: 0.1 },
  { name: 'Huobi', fee: 0.2 },
  { name: 'Bitfinex', fee: 0.2 },
  { name: 'FTX', fee: 0.07 },
  { name: 'Gemini', fee: 0.35 },
  { name: 'Gate.io', fee: 0.2 },
  { name: 'Bybit', fee: 0.1 }
];

const calculateArbitrage = (exchanges: ExchangePrice[]) => {
  const highest = exchanges.reduce((max, exchange) => 
    exchange.price > max.price ? exchange : max
  );
  
  const lowest = exchanges.reduce((min, exchange) => 
    exchange.price < min.price ? exchange : min
  );

  const investmentAmount = 1000;
  const rawProfit = investmentAmount * (highest.price - lowest.price) / lowest.price;
  
  const buyFee = investmentAmount * (lowest.trading_fee / 100);
  const sellFee = (investmentAmount + rawProfit) * (highest.trading_fee / 100);
  const totalFees = buyFee + sellFee;
  
  return {
    highestExchange: highest,
    lowestExchange: lowest,
    potentialProfit: rawProfit,
    profitPercentage: ((highest.price - lowest.price) / lowest.price) * 100,
    profitAfterFees: rawProfit - totalFees
  };
};

const generateExchangePrice = (basePrice: number, exchange: typeof EXCHANGES[0]): ExchangePrice => {
  const variation = (Math.random() * 0.03 - 0.015);
  return {
    exchange: exchange.name,
    price: basePrice * (1 + variation),
    volume_24h: Math.random() * 1000000,
    last_traded: new Date().toISOString(),
    trading_fee: exchange.fee
  };
};

export const useCryptoData = (search: string) => {
  return useQuery<CryptoData[]>(
    ['cryptoData', search],
    async () => {
      const { data } = await axios.get(
        `${COINGECKO_API}/coins/markets`,
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 20,
            page: 1,
            sparkline: false
          }
        }
      );

      const filteredData = search
        ? data.filter((coin: any) => 
            coin.name.toLowerCase().includes(search.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(search.toLowerCase())
          )
        : data;

      const cryptosWithArbitrage = filteredData.map((coin: any) => {
        const exchanges: ExchangePrice[] = EXCHANGES.map(exchange => 
          generateExchangePrice(coin.current_price, exchange)
        );

        return {
          ...coin,
          exchanges,
          arbitrage: calculateArbitrage(exchanges)
        };
      });

      return cryptosWithArbitrage.sort((a, b) => 
        b.arbitrage.profitAfterFees - a.arbitrage.profitAfterFees
      );
    },
    {
      staleTime: 30000,
      cacheTime: 60000,
      refetchInterval: 30000,
      retry: 3
    }
  );
}