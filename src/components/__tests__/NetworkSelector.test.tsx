import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { NetworkSelector } from '../NetworkSelector';

jest.mock('../../utils/ethereum', () => ({
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

describe('NetworkSelector', () => {
  const defaultProps = {
    selectedNetwork: 'ethereum' as const,
    onNetworkChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders network options', () => {
    act(() => {
      render(<NetworkSelector {...defaultProps} />);
    });

    expect(screen.getByText('Network:')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('BNB Chain')).toBeInTheDocument();
    expect(screen.getByText('Polygon')).toBeInTheDocument();
  });

  it('calls onNetworkChange when network is selected', () => {
    act(() => {
      render(<NetworkSelector {...defaultProps} />);
    });

    const polygonButton = screen.getByText('Polygon');
    act(() => {
      fireEvent.click(polygonButton);
    });

    expect(defaultProps.onNetworkChange).toHaveBeenCalledWith('polygon');
  });

  it('highlights selected network', () => {
    act(() => {
      render(<NetworkSelector {...defaultProps} selectedNetwork="polygon" />);
    });

    const polygonButton = screen.getByText('Polygon').closest('button');
    expect(polygonButton).toHaveClass('active');
  });

  it('disables network selection when disabled', () => {
    act(() => {
      render(<NetworkSelector {...defaultProps} disabled={true} />);
    });

    const ethereumButton = screen.getByText('Ethereum').closest('button');
    expect(ethereumButton).toBeDisabled();
  });
}); 