
import React from 'react';
import { User, Transaction } from '../types';
import { Icon } from '../components/Icon';

interface WalletScreenProps {
  user: User;
  transactions: Transaction[];
}

export const WalletScreen: React.FC<WalletScreenProps> = ({ user, transactions }) => {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'earn': return <Icon name="coin" className="w-6 h-6 text-green-400" />;
      case 'withdraw_request': return <Icon name="withdraw" className="w-6 h-6 text-yellow-400" />;
      case 'withdraw_paid': return <Icon name="withdraw" className="w-6 h-6 text-blue-400" />;
      case 'withdraw_rejected': return <Icon name="close" className="w-6 h-6 text-red-400" />;
      default: return <Icon name="coin" className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="p-4 pb-20">
      <h1 className="text-3xl font-bold text-white mb-6">My Wallet</h1>

      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-xl shadow-lg mb-8 text-white">
        <p className="text-lg opacity-80">Current Balance</p>
        <div className="flex items-center">
          <p className="text-5xl font-bold">{user.walletCoins.toLocaleString()}</p>
          <span className="ml-2 text-xl font-semibold">coins</span>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      {transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.slice().reverse().map((tx) => (
            <div key={tx.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between border border-gray-700">
              <div className="flex items-center">
                <div className="mr-4">{getTransactionIcon(tx.type)}</div>
                <div>
                  <p className="font-semibold capitalize text-white">{tx.description}</p>
                  <p className="text-xs text-gray-400">{new Date(tx.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <p className={`font-bold text-lg ${tx.type === 'earn' ? 'text-green-400' : 'text-red-400'}`}>
                {tx.type === 'earn' ? '+' : '-'}{tx.amount}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No transactions yet.</p>
      )}
    </div>
  );
};
