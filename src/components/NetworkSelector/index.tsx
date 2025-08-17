import React from 'react';
import { getNetworkName } from '../../utils/ethereum';
import { ETH, BNB, MATIC } from '../../assets';
import './index.css';

export type NetworkType = 'ethereum' | 'bnb' | 'polygon';

interface NetworkSelectorProps {
  selectedNetwork: NetworkType;
  onNetworkChange: (network: NetworkType) => void;
  disabled?: boolean;
}

const NETWORKS: { value: NetworkType; label: string; icon: string }[] = [
  { value: 'ethereum', label: 'Ethereum', icon: ETH },
  { value: 'bnb', label: 'BNB Chain', icon: BNB },
  { value: 'polygon', label: 'Polygon', icon: MATIC }
];

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  selectedNetwork,
  onNetworkChange,
  disabled = false
}) => {
  return (
    <div className="network-selector">
      <label className="network-label">Network:</label>
      <div className="network-options">
        {NETWORKS.map((network) => (
          <button
            key={network.value}
            className={`network-option ${selectedNetwork === network.value ? 'active' : ''}`}
            onClick={() => onNetworkChange(network.value)}
            disabled={disabled}
            title={getNetworkName(network.value)}
          >
            <img src={network.icon} alt={network.label} width={20} height={20} className="network-icon" />
            <span className="network-name">{network.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}; 