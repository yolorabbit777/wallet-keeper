import { Wallet } from '../types/wallet';
import { STORAGE_KEYS } from '../constants';

export const saveWalletsToStorage = (wallets: Wallet[]): void => {
  try {
    const walletsData = wallets.map(wallet => ({
      ...wallet,
      createdAt: wallet.createdAt.toISOString()
    }));
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(walletsData));
  } catch (error) {
    console.error('Failed to save wallets to storage:', error);
    throw new Error('Failed to save wallets');
  }
};

export const loadWalletsFromStorage = (): Wallet[] => {
  try {
    const walletsData = localStorage.getItem(STORAGE_KEYS.WALLETS);
    if (!walletsData) {
      return [];
    }
    
    const parsedWallets = JSON.parse(walletsData);
    return parsedWallets.map((wallet: any) => ({
      ...wallet,
      createdAt: new Date(wallet.createdAt)
    }));
  } catch (error) {
    console.error('Failed to load wallets from storage:', error);
    return [];
  }
};

export const clearWalletsFromStorage = (): void => {
  localStorage.removeItem(STORAGE_KEYS.WALLETS);
}; 