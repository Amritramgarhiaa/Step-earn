
import React, { useState } from 'react';
import { User } from '../types';
import { MIN_WITHDRAWAL_COINS, WITHDRAWAL_CONVERSION_RATE_INR } from '../constants';

interface WithdrawScreenProps {
  user: User;
  submitWithdrawal: (upi: string) => void;
}

export const WithdrawScreen: React.FC<WithdrawScreenProps> = ({ user, submitWithdrawal }) => {
  const [upi, setUpi] = useState('');
  const canWithdraw = user.walletCoins >= MIN_WITHDRAWAL_COINS;
  const withdrawalValue = (user.walletCoins / MIN_WITHDRAWAL_COINS) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWithdraw) return;
    if (upi.trim() === '') {
        alert('Please enter your UPI ID.');
        return;
    }
    submitWithdrawal(upi);
    setUpi('');
  };

  return (
    <div className="p-4 pb-20">
      <h1 className="text-3xl font-bold text-white mb-6">Withdraw Coins</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6 border border-gray-700">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-gray-400">Your current balance:</span>
          <span className="text-2xl font-bold text-green-400">{user.walletCoins} coins</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-gray-400">Minimum to withdraw:</span>
          <span className="text-lg font-semibold text-white">{MIN_WITHDRAWAL_COINS} coins</span>
        </div>
         <div className="flex justify-between items-baseline mt-2 pt-2 border-t border-gray-600">
          <span className="text-gray-400">Estimated value:</span>
          <span className="text-lg font-semibold text-cyan-400">₹{withdrawalValue.toFixed(2)}</span>
        </div>
      </div>
      
      {!canWithdraw && (
        <div className="text-center p-4 bg-yellow-900/50 border border-yellow-700 text-yellow-300 rounded-lg">
          You need at least {MIN_WITHDRAWAL_COINS - user.walletCoins} more coins to be able to withdraw.
        </div>
      )}

      {canWithdraw && (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Withdrawal Request</h2>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={user.name}
              readOnly
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              readOnly
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300 cursor-not-allowed"
            />
          </div>
           <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="upi">
              UPI ID
            </label>
            <input
              id="upi"
              type="text"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              placeholder="yourname@bank"
              required
              className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            disabled={!canWithdraw}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Request Withdrawal ({user.walletCoins} coins)
          </button>
        </form>
      )}
    </div>
  );
};
