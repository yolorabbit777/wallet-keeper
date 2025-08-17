import { useState, useEffect, useCallback } from 'react';
import { NetworkType } from '../types/wallet';
import { getWalletBalance } from '../utils/ethereum';

interface UseBalanceReturn {
  balance: string;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

export const useBalance = (address: string, network: NetworkType): UseBalanceReturn => {
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const balanceResult = await getWalletBalance(address, network);
      setBalance(balanceResult);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
    } finally {
      setIsLoading(false);
    }
  }, [address, network]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    isLoading,
    error,
    lastUpdated,
    refresh: fetchBalance
  };
}; 