import React from 'react';
import { Wallet, NetworkType } from '../../types/wallet';
import { shortenAddress } from '../../utils/ethereum';
import { useBalance } from '../../hooks/useBalance';
import { FaRotate, FaSpinner } from 'react-icons/fa6';
import './index.css';

const IconRotate = FaRotate as unknown as React.FC;
const IconSpinner = FaSpinner as unknown as React.FC;

interface WalletCardProps {
  wallet: Wallet;
  network: NetworkType;
  networkSymbol: string;
  onSelect: (wallet: Wallet) => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  network,
  networkSymbol,
  onSelect
}) => {
  const { balance, isLoading, error, refresh } = useBalance(wallet.address, network);

  const handleRefresh = () => {
    refresh();
  };

  const handleSelect = () => {
    onSelect(wallet);
  };

  const getBalanceDisplay = () => {
    if (isLoading) {
      return 'Loading...';
    }
    if (error) {
      return 'Error';
    }
    return `${parseFloat(balance).toFixed(4)} ${networkSymbol}`;
  };

  return (
    <div className="wallet-card">
      <div className="wallet-header">
        <h3>{wallet.name}</h3>
        <button
          className={`refresh-button ${isLoading ? 'spinning' : ''}`}
          onClick={handleRefresh}
          disabled={isLoading}
          title="Refresh balance"
        >
          {isLoading ? <IconSpinner /> : <IconRotate />}
        </button>
      </div>
      
      <div className="wallet-address">
        <span className="address-label">Address:</span>
        <span className="address-value">{shortenAddress(wallet.address)}</span>
      </div>
      
      <div className="wallet-balance">
        <span className="balance-label">Balance ({networkSymbol}):</span>
        <span className={`balance-value ${error ? 'error' : ''}`}>
          {getBalanceDisplay()}
        </span>
      </div>
      
      <div className="wallet-actions">
        <button
          className="view-button"
          onClick={handleSelect}
        >
          View Details
        </button>
      </div>
      
      <div className="wallet-date">
        Created: {new Date(wallet.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}; 