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

jest.mock('../../utils/crypto', () => ({
  decryptPrivateKey: jest.fn(() => 'decrypted-private-key'),
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

// Mock react-icons
jest.mock('react-icons/fa6', () => ({
  FaRotate: () => <span></span>,
  FaSpinner: () => <span></span>,
  FaCopy: () => <span></span>,
}));

import { WalletDetails } from '../WalletDetails';
import { Wallet } from '../../types/wallet';
import { useBalance } from '../../hooks/useBalance';

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('WalletDetails', () => {
  const mockWallet: Wallet = {
    id: '1',
    name: 'Test Wallet',
    address: '0x1234567890123456789012345678901234567890',
    encryptedPrivateKey: 'encrypted-key',
    createdAt: new Date('2025-08-16'),
  };

  const defaultProps = {
    wallet: mockWallet,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useBalance as jest.Mock).mockReturnValue({
      balance: '0',
      isLoading: false,
      error: null,
      lastUpdated: new Date(),
      refresh: jest.fn(),
    });
  });

  it('renders wallet details', () => {
    act(() => {
      render(<WalletDetails {...defaultProps} />);
    });

    expect(screen.getByText('Test Wallet')).toBeInTheDocument();
    expect(screen.getByText('Address:')).toBeInTheDocument();
    expect(screen.getByText('0x1234567890123456789012345678901234567890')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    act(() => {
      render(<WalletDetails {...defaultProps} />);
    });

    const closeButton = screen.getByRole('button', { name: '×' });
    act(() => {
      fireEvent.click(closeButton);
    });

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows password form for private key', () => {
    act(() => {
      render(<WalletDetails {...defaultProps} />);
    });

    expect(screen.getByRole('button', { name: 'View Private Key' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('decrypts private key with valid password', () => {
    act(() => {
      render(<WalletDetails {...defaultProps} />);
    });

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const decryptButton = screen.getByRole('button', { name: 'View Private Key' });

    act(() => {
      fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
      fireEvent.click(decryptButton);
    });

    expect(screen.getByText('Private Key')).toBeInTheDocument();
  });

  it('shows error for invalid password', () => {
    const { decryptPrivateKey } = require('../../utils/crypto');
    decryptPrivateKey.mockImplementation(() => {
      throw new Error('Invalid password');
    });

    act(() => {
      render(<WalletDetails {...defaultProps} />);
    });

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const decryptButton = screen.getByRole('button', { name: 'View Private Key' });

    act(() => {
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(decryptButton);
    });

    expect(screen.getByText('Invalid password. Please try again.')).toBeInTheDocument();
  });
}); 