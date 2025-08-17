import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Wallet } from '../../types/wallet';
import { saveWalletsToStorage, loadWalletsFromStorage } from '../../utils/storage';
import { generateWallet } from '../../utils/ethereum';
import { encryptPrivateKey, generateWalletId } from '../../utils/crypto';

export const loadWallets = createAsyncThunk(
  'wallet/loadWallets',
  async () => {
    const wallets = loadWalletsFromStorage();
    return wallets;
  }
);

export const createWallet = createAsyncThunk(
  'wallet/createWallet',
  async ({ password, name }: { password: string; name: string }, { getState }) => {
    const { wallet } = getState() as { wallet: WalletState };
    const { address, privateKey } = generateWallet();
    const encryptedPrivateKey = encryptPrivateKey(privateKey, password);
    
    const newWallet: Wallet = {
      id: generateWalletId(),
      address,
      encryptedPrivateKey,
      name: name || `Wallet ${wallet.wallets.length + 1}`,
      createdAt: new Date()
    };
    
    return newWallet;
  }
);

export interface WalletState {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  wallets: [],
  selectedWallet: null,
  isLoading: false,
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setSelectedWallet: (state, action: PayloadAction<Wallet | null>) => {
      state.selectedWallet = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWallets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadWallets.fulfilled, (state, action) => {
        state.wallets = action.payload;
        state.isLoading = false;
      })
      .addCase(loadWallets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load wallets';
      });

    builder
      .addCase(createWallet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createWallet.fulfilled, (state, action) => {
        state.wallets.push(action.payload);
        saveWalletsToStorage(state.wallets);
        state.isLoading = false;
      })
      .addCase(createWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create wallet';
      });
  },
});

export const { 
  setSelectedWallet, 
  clearError
} = walletSlice.actions;

export default walletSlice.reducer; 