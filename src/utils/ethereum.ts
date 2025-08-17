import { ethers } from 'ethers';
import { NETWORK_RPC_URLS, NETWORK_NAMES } from '../constants';

export const generateWallet = (): { address: string; privateKey: string } => {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey
  };
};

export const getWalletBalance = async (address: string, network: keyof typeof NETWORK_RPC_URLS = 'ethereum'): Promise<string> => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(NETWORK_RPC_URLS[network]);
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error(`Failed to fetch balance for ${address} on ${network}:`, error);
    return '0';
  }
};

export const validateAddress = (address: string): boolean => {
  try {
    ethers.utils.getAddress(address);
    return true;
  } catch {
    return false;
  }
};

export const shortenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getNetworkName = (network: keyof typeof NETWORK_RPC_URLS): string => {
  return NETWORK_NAMES[network];
}; 