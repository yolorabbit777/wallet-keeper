import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { PASSWORD_REQUIREMENTS } from '../../constants';
import './index.css';

const IconEye = FaEye as unknown as React.FC;
const IconEyeSlash = FaEyeSlash as unknown as React.FC;

interface CreateWalletProps {
  onCreateWallet: (password: string, name: string) => void;
  isLoading: boolean;
}

export const CreateWallet: React.FC<CreateWalletProps> = ({
  onCreateWallet,
  isLoading
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [walletName, setWalletName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!walletName.trim()) {
      newErrors.push('Wallet name is required');
    }

    if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
      newErrors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters long`);
    }

    if (password !== confirmPassword) {
      newErrors.push('Passwords do not match');
    }

    if (PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      newErrors.push('Password must contain at least one uppercase letter');
    }

    if (PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      newErrors.push('Password must contain at least one lowercase letter');
    }

    if (PASSWORD_REQUIREMENTS.REQUIRE_NUMBER && !/\d/.test(password)) {
      newErrors.push('Password must contain at least one number');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCreateWallet(password, walletName.trim());
      setPassword('');
      setConfirmPassword('');
      setWalletName('');
      setErrors([]);
    }
  };

  return (
    <div className="create-wallet">
      <h2>Create New Wallet</h2>
      
      <form onSubmit={handleSubmit} className="create-wallet-form">
        <div className="form-group">
          <label htmlFor="walletName">Wallet Name</label>
          <input
            type="text"
            id="walletName"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            placeholder="Enter wallet name"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={`Enter password (min ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters)`}
              disabled={isLoading}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <IconEyeSlash /> : <IconEye />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            disabled={isLoading}
          />
        </div>

        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <p key={index} className="error-message">
                {error}
              </p>
            ))}
          </div>
        )}

        <div className="password-requirements">
          <h4>Password Requirements:</h4>
          <ul>
            <li>At least {PASSWORD_REQUIREMENTS.MIN_LENGTH} characters long</li>
            {PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE && <li>Contains uppercase letter</li>}
            {PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE && <li>Contains lowercase letter</li>}
            {PASSWORD_REQUIREMENTS.REQUIRE_NUMBER && <li>Contains number</li>}
          </ul>
        </div>

        <button
          type="submit"
          className="create-button"
          disabled={isLoading || !password || !confirmPassword || !walletName}
        >
          {isLoading ? 'Creating Wallet...' : 'Create Wallet'}
        </button>
      </form>

      <div className="security-note">
        <p>
          <strong>Security Note:</strong> Your password is used to encrypt your private key locally. 
          We never store your password or private key in plain text. Make sure to remember your password 
          as it cannot be recovered if lost.
        </p>
      </div>
    </div>
  );
}; 