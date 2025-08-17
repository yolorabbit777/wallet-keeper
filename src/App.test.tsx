import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './store/slices/walletSlice';
import App from './App';

// Mock the hooks
jest.mock('./hooks/useTotalBalance', () => ({
  useTotalBalance: () => ({
    totalBalance: 5.6789,
    isLoading: false,
    error: null,
    refreshAll: jest.fn(),
  }),
}));

jest.mock('./hooks/useBalance', () => ({
  useBalance: () => ({
    balance: '1.2345',
    isLoading: false,
    error: null,
    refresh: jest.fn(),
  }),
}));

// Mock react-icons
jest.mock('react-icons/fa6', () => ({
  FaRotate: () => <span>🔄</span>,
  FaSpinner: () => <span>⏳</span>,
}));

const createMockStore = () => {
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
      },
    },
  });
};

describe('App', () => {
  it('renders the app header', () => {
    const store = createMockStore();
    act(() => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
    });

    expect(screen.getByText('Wallet Keeper')).toBeInTheDocument();
    expect(screen.getByText('Create Wallet')).toBeInTheDocument();
  });

  it('displays total balance', () => {
    const store = createMockStore();
    act(() => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
    });

    expect(screen.getByText('Total Balance (ETH)')).toBeInTheDocument();
    expect(screen.getByText('5.6789 ETH')).toBeInTheDocument();
  });

  it('shows wallet count', () => {
    const store = createMockStore();
    act(() => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
    });

    expect(screen.getByText('0 wallets')).toBeInTheDocument();
  });
});
