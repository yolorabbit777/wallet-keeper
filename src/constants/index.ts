import { NetworkType } from '../types/wallet';

export const NETWORK_SYMBOLS: Record<NetworkType, string> = {
  ethereum: 'ETH',
  polygon: 'MATIC',
  bnb: 'BNB'
};

export const NETWORK_NAMES: Record<NetworkType, string> = {
  ethereum: 'Ethereum',
  polygon: 'Polygon',
  bnb: 'BNB Smart Chain'
};

export const NETWORK_RPC_URLS: Record<NetworkType, string> = {
  ethereum: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  polygon: 'https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  bnb: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
};

export const DEFAULT_NETWORK: NetworkType = 'ethereum';

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true
} as const;

export const STORAGE_KEYS = {
  WALLETS: 'wallets',
  SETTINGS: 'wallet-keeper-settings'
} as const; 