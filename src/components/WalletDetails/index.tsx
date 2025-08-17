import React, { useState } from 'react';
import { Wallet, DecryptedWallet, NetworkType } from '../../types/wallet';
import { decryptPrivateKey } from '../../utils/crypto';
import { shortenAddress } from '../../utils/ethereum';
import { NetworkSelector } from '../NetworkSelector';
import { useBalance } from '../../hooks/useBalance';
import { NETWORK_SYMBOLS } from '../../constants';
import { FaRotate, FaSpinner, FaCopy } from 'react-icons/fa6';
import './index.css';

const IconRotate = FaRotate as unknown as React.FC;
const IconSpinner = FaSpinner as unknown as React.FC;
const IconCopy = FaCopy as unknown as React.FC;

interface WalletDetailsProps {
  wallet: Wallet;
  onClose: () => void;
}

export const WalletDetails: React.FC<WalletDetailsProps> = ({
  wallet,
  onClose
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('ethereum');
  const [password, setPassword] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [decryptedWallet, setDecryptedWallet] = useState<DecryptedWallet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { balance, isLoading: balanceLoading, error: balanceError, refresh } = useBalance(wallet.address, selectedNetwork);

  const handleDecryptPrivateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const privateKey = decryptPrivateKey(wallet.encryptedPrivateKey, password);
      setDecryptedWallet({
        address: wallet.address,
        privateKey,
        name: wallet.name
      });
      setShowPrivateKey(true);
      setPassword('');
    } catch (error) {
      setError('Invalid password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshBalance = async () => {
    refresh();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} copied to clipboard!`);
    }).catch(() => {
      setError('Failed to copy to clipboard');
    });
  };

  const getBalanceDisplay = () => {
    if (balanceLoading) {
      return 'Loading...';
    }
    if (balanceError) {
      return 'Error';
    }
    return `${parseFloat(balance).toFixed(4)} ${NETWORK_SYMBOLS[selectedNetwork]}`;
  };

  return (
    <div className="wallet-details-overlay">
      <div className="wallet-details-modal">
        <div className="modal-header">
          <h2>{wallet.name}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="wallet-info">
            <div className="info-row">
              <span className="label">Address:</span>
              <div className="value-container">
                <span className="value">{wallet.address}</span>
                <button
                  className="copy-button"
                  onClick={() => copyToClipboard(wallet.address, 'Address')}
                >
                  <IconCopy />
                </button>
              </div>
            </div>

            <div className="info-row">
              <span className="label">Short Address:</span>
              <span className="value">{shortenAddress(wallet.address)}</span>
            </div>

            <div className="info-row">
              <span className="label">Network:</span>
              <div className="network-selector-container">
                <NetworkSelector
                  selectedNetwork={selectedNetwork}
                  onNetworkChange={setSelectedNetwork}
                  disabled={balanceLoading}
                />
              </div>
            </div>

            <div className="info-row">
              <span className="label">Balance ({NETWORK_SYMBOLS[selectedNetwork]}):</span>
              <div className="balance-container">
                <span className={`value ${balanceError ? 'error' : ''}`}>
                  {getBalanceDisplay()}
                </span>
                <button
                  className={`refresh-button ${balanceLoading ? 'spinning' : ''}`}
                  onClick={handleRefreshBalance}
                  disabled={balanceLoading}
                >
                  {balanceLoading ? <IconSpinner /> : <IconRotate />}
                </button>
              </div>
            </div>

            <div className="info-row">
              <span className="label">Created:</span>
              <span className="value">{new Date(wallet.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {!showPrivateKey ? (
            <div className="private-key-section">
              <h3>View Private Key</h3>
              <p>Enter your password to view the private key:</p>
              
              <form onSubmit={handleDecryptPrivateKey} className="password-form">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading || !password}
                  className="decrypt-button"
                >
                  {isLoading ? 'Decrypting...' : 'View Private Key'}
                </button>
              </form>

              {error && <p className="error-message">{error}</p>}
            </div>
          ) : (
            <div className="private-key-section">
              <h3>Private Key</h3>
              <div className="warning">
                <p>⚠️ <strong>Warning:</strong> Never share your private key with anyone!</p>
              </div>
              
              <div className="private-key-container">
                <span className="private-key">{decryptedWallet?.privateKey}</span>
                <button
                  className="copy-button"
                  onClick={() => copyToClipboard(decryptedWallet?.privateKey || '', 'Private Key')}
                >
                  <IconCopy />
                </button>
              </div>
              
              <button
                className="hide-button"
                onClick={() => {
                  setShowPrivateKey(false);
                  setDecryptedWallet(null);
                }}
              >
                Hide Private Key
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 