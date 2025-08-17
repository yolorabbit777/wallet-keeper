import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { WalletList } from './components/WalletList';
import { CreateWallet } from './components/CreateWallet';
import { WalletDetails } from './components/WalletDetails';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { 
  loadWallets, 
  createWallet, 
  setSelectedWallet, 
  clearError
} from './store/slices/walletSlice';
import { 
  selectWallets, 
  selectSelectedWallet, 
  selectIsLoading, 
  selectError
} from './store/selectors';
import { useTotalBalance } from './hooks/useTotalBalance';
import { NetworkType } from './types/wallet';
import { NETWORK_SYMBOLS, DEFAULT_NETWORK } from './constants';
import { FaRotate, FaSpinner } from 'react-icons/fa6';
import './App.css';

const IconRotate = FaRotate as unknown as React.FC;
const IconSpinner = FaSpinner as unknown as React.FC;

function AppContent() {
  const dispatch = useAppDispatch();
  const wallets = useAppSelector(selectWallets);
  const selectedWallet = useAppSelector(selectSelectedWallet);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  
  const [showCreateWallet, setShowCreateWallet] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>(DEFAULT_NETWORK);

  const { totalBalance, isLoading: totalBalanceLoading, error: totalBalanceError, refreshAll } = useTotalBalance(wallets, selectedNetwork);

  useEffect(() => {
    dispatch(loadWallets());
  }, [dispatch]);

  const handleCreateWallet = (password: string, name: string) => {
    dispatch(createWallet({ password, name }));
    setShowCreateWallet(false);
  };

  const handleSelectWallet = (wallet: any) => {
    dispatch(setSelectedWallet(wallet));
  };

  const handleCloseWalletDetails = () => {
    dispatch(setSelectedWallet(null));
  };

  const handleRefreshAllBalances = () => {
    refreshAll();
  };

  const handleNetworkChange = (network: NetworkType) => {
    setSelectedNetwork(network);
  };

  const getTotalBalanceDisplay = () => {
    if (totalBalanceLoading) {
      return 'Loading...';
    }
    if (totalBalanceError) {
      return 'Error';
    }
    return `${totalBalance.toFixed(4)} ${NETWORK_SYMBOLS[selectedNetwork]}`;
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">Wallet Keeper</h1>
            <p className="app-subtitle">Secure EVM Wallet Management</p>
          </div>
          <div className="header-right">
            <button
              className="create-wallet-btn"
              onClick={() => setShowCreateWallet(true)}
              disabled={isLoading}
            >
              Create Wallet
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="balance-overview">
          <div className="balance-card">
            <div className="balance-header">
              <h2>Total Balance ({NETWORK_SYMBOLS[selectedNetwork]})</h2>
              <button
                className={`refresh-all-btn ${totalBalanceLoading ? 'spinning' : ''}`}
                onClick={handleRefreshAllBalances}
                disabled={totalBalanceLoading}
              >
                {totalBalanceLoading ? <IconSpinner /> : <IconRotate />}
              </button>
            </div>
            <div className="balance-amount">
              {getTotalBalanceDisplay()}
            </div>
            <div className="wallet-count">
              {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {(error || totalBalanceError) && (
          <div className="error-banner">
            <span>{error || totalBalanceError}</span>
            <button onClick={() => dispatch(clearError())}>×</button>
          </div>
        )}

        {(isLoading || totalBalanceLoading) && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        )}

        {showCreateWallet ? (
          <CreateWallet
            onCreateWallet={handleCreateWallet}
            isLoading={isLoading}
          />
        ) : (
          <WalletList
            onSelectWallet={handleSelectWallet}
            selectedNetwork={selectedNetwork}
            onNetworkChange={handleNetworkChange}
          />
        )}

        {selectedWallet && (
          <WalletDetails
            wallet={selectedWallet}
            onClose={handleCloseWalletDetails}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
