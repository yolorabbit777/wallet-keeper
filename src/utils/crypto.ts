import CryptoJS from 'crypto-js';

export const encryptPrivateKey = (privateKey: string, password: string): string => {
  return CryptoJS.AES.encrypt(privateKey, password).toString();
};

export const decryptPrivateKey = (encryptedPrivateKey: string, password: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      throw new Error('Invalid password or corrupted data');
    }
    
    return decrypted;
  } catch (error) {
    throw new Error('Failed to decrypt private key. Please check your password.');
  }
};

export const generateWalletId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}; 