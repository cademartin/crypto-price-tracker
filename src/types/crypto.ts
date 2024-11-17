export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
  exchanges: ExchangePrice[];
  arbitrage: ArbitrageInfo;
}

export interface ExchangePrice {
  exchange: string;
  price: number;
  volume_24h: number;
  last_traded: string;
  trading_fee: number;
}

export interface ArbitrageInfo {
  highestExchange: ExchangePrice;
  lowestExchange: ExchangePrice;
  potentialProfit: number;
  profitPercentage: number;
  profitAfterFees: number;
}

export interface MarketData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}