import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

// Mock the hooks and utilities
jest.mock('../../hooks/useBalance', () => ({
  __esModule: true,
  useBalance: jest.fn(() => ({
    balance: '1.2345',
    isLoading: false,
    error: null,
    lastUpdated: new Date(),
    refresh: jest.fn(),
  })),
}));

jest.mock('../../utils/ethereum', () => ({
  shortenAddress: jest.fn((address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`),
  getNetworkName: jest.fn((network: string) => {
    const names = {
      ethereum: 'Ethereum Sepolia',
      bnb: 'BNB Smart Chain Testnet',
      polygon: 'Polygon Mumbai'
    };
    return names[network as keyof typeof names] || network;
  }),
}));

jest.mock('../../assets', () => ({
  ETH: 'eth-icon.png',
  BNB: 'bnb-icon.png',
  MATIC: 'matic-icon.png',
}));

// Mock react-icons
jest.mock('react-icons/fa6', () => ({
  FaRotate: () => <span></span>,
  FaSpinner: () => <span></span>,
}));

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import walletReducer from '../../store/slices/walletSlice';
import { WalletList } from '../WalletList';
import { Wallet } from '../../types/wallet';
import { useBalance } from '../../hooks/useBalance';

const mockWallets: Wallet[] = [
  {
    id: '1',
    name: 'Test Wallet 1',
    address: '0x1234567890123456789012345678901234567890',
    encryptedPrivateKey: 'encrypted-key-1',
    createdAt: new Date('2025-08-16'),
  },
  {
    id: '2',
    name: 'Test Wallet 2',
    address: '0x9876543210987654321098765432109876543210',
    encryptedPrivateKey: 'encrypted-key-2',
    createdAt: new Date('2025-08-17'),
  },
];

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      wallet: walletReducer,
    },
    preloadedState: {
      wallet: {
        wallets: [],
        selectedWallet: null,
        isLoading: false,
        error: null,
        ...initialState,
      },
    },
  });
};

const renderWalletList = (props = {}, storeState = {}) => {
  const defaultProps = {
    onSelectWallet: jest.fn(),
    selectedNetwork: 'ethereum' as const,
    onNetworkChange: jest.fn(),
    ...props,
  };

  const store = createMockStore(storeState);

  return render(
    <Provider store={store}>
      <WalletList {...defaultProps} />
    </Provider>
  );
};

describe('WalletList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useBalance as jest.Mock).mockReturnValue({
      balance: '1.2345',
      isLoading: false,
      error: null,
      lastUpdated: new Date(),
      refresh: jest.fn(),
    });
  });

  it('renders wallet cards for each wallet', () => {
    act(() => {
      renderWalletList({}, { wallets: mockWallets });
    });

    expect(screen.getByText('Your Wallets')).toBeInTheDocument();
    expect(screen.getByText('Test Wallet 1')).toBeInTheDocument();
    expect(screen.getByText('Test Wallet 2')).toBeInTheDocument();
  });

  it('shows empty state when no wallets', () => {
    act(() => {
      renderWalletList();
    });

    expect(screen.getByText('No wallets found. Create your first wallet to get started!')).toBeInTheDocument();
  });

  it('calls onSelectWallet when wallet is selected', () => {
    const onSelectWallet = jest.fn();
    act(() => {
      renderWalletList({ onSelectWallet }, { wallets: mockWallets });
    });

    const viewDetailsButton = screen.getAllByText('View Details')[0];
    act(() => {
      fireEvent.click(viewDetailsButton);
    });

    expect(onSelectWallet).toHaveBeenCalledWith(mockWallets[0]);
  });

  it('renders network selector', () => {
    act(() => {
      renderWalletList({}, { wallets: mockWallets });
    });

    expect(screen.getByText('Network:')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });
}); 