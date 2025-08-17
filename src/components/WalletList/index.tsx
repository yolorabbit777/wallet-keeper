import React from 'react';
import { Wallet, NetworkType } from '../../types/wallet';
import { NetworkSelector } from '../NetworkSelector';
import { WalletCard } from '../WalletCard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedWallet } from '../../store/slices/walletSlice';
import { selectWallets, selectIsLoading } from '../../store/selectors';
import { NETWORK_SYMBOLS } from '../../constants';
import './index.css';

interface WalletListProps {
  onSelectWallet: (wallet: Wallet) => void;
  selectedNetwork: NetworkType;
  onNetworkChange: (network: NetworkType) => void;
}

export const WalletList: React.FC<WalletListProps> = ({
  onSelectWallet,
  selectedNetwork,
  onNetworkChange
}) => {
  const dispatch = useAppDispatch();
  const wallets = useAppSelector(selectWallets);
  const isLoading = useAppSelector(selectIsLoading);

  const handleSelectWallet = (wallet: Wallet) => {
    dispatch(setSelectedWallet(wallet));
    onSelectWallet(wallet);
  };

  if (wallets.length === 0) {
    return (
      <div className="wallet-list-empty">
        <p>No wallets found. Create your first wallet to get started!</p>
      </div>
    );
  }

  return (
    <div className="wallet-list">
      <div className="wallet-list-header">
        <h2>Your Wallets</h2>
        <NetworkSelector
          selectedNetwork={selectedNetwork}
          onNetworkChange={onNetworkChange}
          disabled={isLoading}
        />
      </div>
      
      <div className="wallet-grid">
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            network={selectedNetwork}
            networkSymbol={NETWORK_SYMBOLS[selectedNetwork]}
            onSelect={handleSelectWallet}
          />
        ))}
      </div>
    </div>
  );
}; 