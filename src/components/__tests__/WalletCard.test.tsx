import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

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
}));

jest.mock('react-icons/fa6', () => ({
  FaRotate: () => <span></span>,
  FaSpinner: () => <span></span>,
}));

import { WalletCard } from '../WalletCard';
import { Wallet } from '../../types/wallet';
import { useBalance } from '../../hooks/useBalance';

describe('WalletCard', () => {
  const mockWallet: Wallet = {
    id: '1',
    name: 'Test Wallet',
    address: '0x1234567890123456789012345678901234567890',
    encryptedPrivateKey: 'encrypted-key',
    createdAt: new Date('2025-08-14'),
  };

  const defaultProps = {
    wallet: mockWallet,
    network: 'ethereum' as const,
    networkSymbol: 'ETH',
    onSelect: jest.fn(),
  };

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

  it('renders wallet information', () => {
    act(() => {
      render(<WalletCard {...defaultProps} />);
    });

    expect(screen.getByText('Test Wallet')).toBeInTheDocument();
    expect(screen.getByText('Address:')).toBeInTheDocument();
    expect(screen.getByText('Balance (ETH):')).toBeInTheDocument();
    expect(screen.getByText('1.2345 ETH')).toBeInTheDocument();
  });

  it('calls onSelect when view details button is clicked', () => {
    act(() => {
      render(<WalletCard {...defaultProps} />);
    });

    const viewButton = screen.getByText('View Details');
    act(() => {
      fireEvent.click(viewButton);
    });

    expect(defaultProps.onSelect).toHaveBeenCalledWith(mockWallet);
  });

  it('shows loading state when balance is loading', () => {
    (useBalance as jest.Mock).mockReturnValue({
      balance: '1.2345',
      isLoading: true,
      error: null,
      lastUpdated: new Date(),
      refresh: jest.fn(),
    });

    act(() => {
      render(<WalletCard {...defaultProps} />);
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state when balance has error', () => {
    (useBalance as jest.Mock).mockReturnValue({
      balance: '0',
      isLoading: false,
      error: 'Failed to fetch balance',
      lastUpdated: new Date(),
      refresh: jest.fn(),
    });

    act(() => {
      render(<WalletCard {...defaultProps} />);
    });

    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});
