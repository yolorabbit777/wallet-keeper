import { useState, useEffect, useCallback } from 'react';
import { Wallet, NetworkType } from '../types/wallet';
import { getWalletBalance } from '../utils/ethereum';

interface UseTotalBalanceReturn {
  totalBalance: number;
  isLoading: boolean;
  error: string | null;
  refreshAll: () => Promise<void>;
}

export const useTotalBalance = (wallets: Wallet[], network: NetworkType): UseTotalBalanceReturn => {
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllBalances = useCallback(async () => {
    if (wallets.length === 0) {
      setTotalBalance(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const balancePromises = wallets.map(async (wallet) => {
        try {
          const balance = await getWalletBalance(wallet.address, network);
          return parseFloat(balance) || 0;
        } catch (err) {
          console.error(`Failed to fetch balance for wallet ${wallet.id}:`, err);
          return 0;
        }
      });

      const balances = await Promise.all(balancePromises);
      const total = balances.reduce((sum, balance) => sum + balance, 0);
      setTotalBalance(total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch total balance');
    } finally {
      setIsLoading(false);
    }
  }, [wallets, network]);

  useEffect(() => {
    fetchAllBalances();
  }, [fetchAllBalances]);

  return {
    totalBalance,
    isLoading,
    error,
    refreshAll: fetchAllBalances
  };
}; 