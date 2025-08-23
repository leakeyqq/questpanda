'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { sdk } from '@farcaster/frame-sdk';

interface CurrencyContextType {
  currency: 'cUSD' | 'USD';
  isMinipay: boolean;
  isFarcaster: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  isMinipay: false,
  isFarcaster: false,
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [isMinipay, setIsMinipay] = useState(false);
  const [isFarcaster, setIsFarcaster] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkEnvironments = async () => {
      try {
        // Check for MiniPay
        const miniPayDetected = !!(window.ethereum?.isMiniPay);
        setIsMinipay(miniPayDetected);

        // Check for Farcaster
        const farcasterDetected = await sdk.isInMiniApp();
        setIsFarcaster(farcasterDetected);

      } catch (error) {
        console.error('Error detecting environments:', error);
        setIsMinipay(false);
        setIsFarcaster(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkEnvironments();
  }, []);


  // Determine currency based on environment
  const currency = (isMinipay || isFarcaster) ? 'cUSD' : 'USD';

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <CurrencyContext.Provider value={{ currency, isMinipay, isFarcaster }}>
      {children}
    </CurrencyContext.Provider>
  );
};