export interface Wallet {
  id: string;
  address: string;
  encryptedPrivateKey: string;
  name: string;
  createdAt: Date;
}

export interface WalletState {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  isLoading: boolean;
  error: string | null;
}

export interface WalletAction {
  type: 'ADD_WALLET' | 'SET_WALLETS' | 'SELECT_WALLET' | 'SET_LOADING' | 'SET_ERROR' | 'CLEAR_ERROR';
  payload?: any;
}

export interface DecryptedWallet {
  address: string;
  privateKey: string;
  name: string;
}

export type NetworkType = 'ethereum' | 'bnb' | 'polygon'; 