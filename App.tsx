
import React, { useState, useCallback, useEffect } from 'react';
import { Screen, User, PendingCoin, Transaction, WithdrawRequest } from './types';
import { STEPS_PER_COIN } from './constants';

import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { WalletScreen } from './screens/WalletScreen';
import { WithdrawScreen } from './screens/WithdrawScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { BottomNav } from './components/BottomNav';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Home);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([]);

  // Mock Authentication
  const handleLogin = (email: string, name: string) => {
    const today = new Date().toISOString().split('T')[0];
    setUser({
      uid: `user_${Date.now()}`,
      email,
      name,
      steps: 0,
      walletCoins: 100, // Start with some coins for demo
      pendingCoins: [],
      dailyCoinsEarned: {
        date: today,
        count: 0
      }
    });
    setTransactions([{
        id: `tx_${Date.now()}`,
        type: 'earn',
        amount: 100,
        description: 'Welcome bonus',
        timestamp: Date.now()
    }]);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveScreen(Screen.Home);
    setTransactions([]);
    setWithdrawRequests([]);
  };

  // Business Logic
  const addSteps = useCallback((stepsToAdd: number) => {
    if (!user) return;
    setUser(currentUser => {
      if (!currentUser) return null;
      const newTotalSteps = currentUser.steps + stepsToAdd;
      const newPendingCoins: PendingCoin[] = [...currentUser.pendingCoins];
      
      let stepsProcessed = currentUser.steps % STEPS_PER_COIN;
      let stepsAvailable = stepsProcessed + stepsToAdd;

      while(stepsAvailable >= STEPS_PER_COIN) {
        stepsAvailable -= STEPS_PER_COIN;
        newPendingCoins.push({ id: `pc_${Date.now()}_${newPendingCoins.length}`, createdAt: Date.now() });
      }

      return { ...currentUser, steps: newTotalSteps, pendingCoins: newPendingCoins };
    });
  }, [user]);

  const claimCoin = useCallback((coinId: string) => {
    if (!user) return;
    setUser(currentUser => {
      if (!currentUser) return null;
      const coinToClaim = currentUser.pendingCoins.find(c => c.id === coinId);
      if (!coinToClaim) return currentUser;

      const today = new Date().toISOString().split('T')[0];
      const dailyCount = currentUser.dailyCoinsEarned.date === today ? currentUser.dailyCoinsEarned.count : 0;

      const newPendingCoins = currentUser.pendingCoins.filter(c => c.id !== coinId);
      const newWalletCoins = currentUser.walletCoins + 1;
      
      const newTransaction: Transaction = {
          id: `tx_${Date.now()}`,
          type: 'earn',
          amount: 1,
          description: 'Claimed from steps',
          timestamp: Date.now()
      };
      setTransactions(prev => [...prev, newTransaction]);
      
      return { 
          ...currentUser,
          walletCoins: newWalletCoins,
          pendingCoins: newPendingCoins,
          dailyCoinsEarned: {
              date: today,
              count: dailyCount + 1
          }
      };
    });
  }, [user]);

  const submitWithdrawal = useCallback((upi: string) => {
      if (!user) return;

      const coinsToWithdraw = user.walletCoins;
      const newRequest: WithdrawRequest = {
          id: `wr_${Date.now()}`,
          uid: user.uid,
          name: user.name,
          email: user.email,
          upi,
          coinsRequested: coinsToWithdraw,
          status: 'pending',
          createdAt: Date.now(),
      };
      setWithdrawRequests(prev => [...prev, newRequest]);
      
      const newTransaction: Transaction = {
          id: `tx_${Date.now()}`,
          type: 'withdraw_request',
          amount: coinsToWithdraw,
          description: `Withdrawal to ${upi}`,
          timestamp: Date.now()
      };
      setTransactions(prev => [...prev, newTransaction]);

      setUser(currentUser => {
          if (!currentUser) return null;
          return { ...currentUser, walletCoins: 0 };
      });

      alert(`Withdrawal request for ${coinsToWithdraw} coins submitted! An admin will review it shortly.`);

  }, [user]);


  const renderScreen = () => {
    if (!user) return <LoginScreen onLogin={handleLogin} />;

    switch (activeScreen) {
      case Screen.Home:
        return <HomeScreen user={user} addSteps={addSteps} claimCoin={claimCoin} />;
      case Screen.Wallet:
        return <WalletScreen user={user} transactions={transactions} />;
      case Screen.Withdraw:
        return <WithdrawScreen user={user} submitWithdrawal={submitWithdrawal} />;
      case Screen.Profile:
        return <ProfileScreen user={user} onLogout={handleLogout} />;
      default:
        return <HomeScreen user={user} addSteps={addSteps} claimCoin={claimCoin} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white font-sans overflow-y-auto">
      <div className="max-w-md mx-auto h-full">
        <main>{renderScreen()}</main>
        {user && <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />}
      </div>
    </div>
  );
};

export default App;
