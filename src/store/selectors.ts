import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';

export const selectWalletState = (state: RootState) => state.wallet;
export const selectWallets = (state: RootState) => state.wallet.wallets;
export const selectSelectedWallet = (state: RootState) => state.wallet.selectedWallet;
export const selectIsLoading = (state: RootState) => state.wallet.isLoading;
export const selectError = (state: RootState) => state.wallet.error;

export const selectWalletCount = createSelector(
  [selectWallets],
  (wallets) => wallets.length
);

export const selectWalletById = createSelector(
  [selectWallets, (_state: RootState, walletId: string) => walletId],
  (wallets, walletId) => wallets.find(wallet => wallet.id === walletId)
); 