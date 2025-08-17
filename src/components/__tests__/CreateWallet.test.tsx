import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CreateWallet } from '../CreateWallet';

jest.mock('react-icons/fa6', () => ({
  FaEye: () => <span></span>,
  FaEyeSlash: () => <span></span>,
}));

describe('CreateWallet', () => {
  const defaultProps = {
    onCreateWallet: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the create wallet form', () => {
    act(() => {
      render(<CreateWallet {...defaultProps} />);
    });

    expect(screen.getByText('Create New Wallet')).toBeInTheDocument();
    expect(screen.getByLabelText('Wallet Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('submits form with valid data', () => {
    act(() => {
      render(<CreateWallet {...defaultProps} />);
    });

    const walletNameInput = screen.getByLabelText('Wallet Name');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Create Wallet' });

    act(() => {
      fireEvent.change(walletNameInput, { target: { value: 'Test Wallet' } });
      fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass123' } });
      fireEvent.click(submitButton);
    });

    expect(defaultProps.onCreateWallet).toHaveBeenCalledWith('ValidPass123', 'Test Wallet');
  });

  it('shows validation error for empty wallet name', () => {
    act(() => {
      render(<CreateWallet {...defaultProps} />);
    });

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Create Wallet' });

    act(() => {
      fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass123' } });
      fireEvent.click(submitButton);
    });
  });

  it('disables form when loading', () => {
    act(() => {
      render(<CreateWallet {...defaultProps} isLoading={true} />);
    });

    const walletNameInput = screen.getByLabelText('Wallet Name');
    const submitButton = screen.getByRole('button', { name: 'Creating Wallet...' });

    expect(walletNameInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
}); 