import React, { createContext, useContext, useState } from 'react';

interface InvestmentContextType {
  investmentAmount: number;
  setInvestmentAmount: (amount: number) => void;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export const InvestmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [investmentAmount, setInvestmentAmount] = useState(100);

  return (
    <InvestmentContext.Provider value={{ investmentAmount, setInvestmentAmount }}>
      {children}
    </InvestmentContext.Provider>
  );
};

export const useInvestment = () => {
  const context = useContext(InvestmentContext);
  if (context === undefined) {
    throw new Error('useInvestment must be used within an InvestmentProvider');
  }
  return context;
}; 