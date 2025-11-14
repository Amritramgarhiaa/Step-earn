
// Fix: Imported `useEffect` to resolve 'Cannot find name' error.
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { User, PendingCoin } from '../types';
import { MAX_DAILY_COINS, STEPS_PER_COIN } from '../constants';
import { Icon } from '../components/Icon';
import { AdModal } from '../components/AdModal';
import { getFitnessTip } from '../services/geminiService';

interface HomeScreenProps {
  user: User;
  addSteps: (steps: number) => void;
  claimCoin: (coinId: string) => void;
}

const StepSimulator: React.FC<{ addSteps: (steps: number) => void }> = ({ addSteps }) => {
  const [stepsToAdd, setStepsToAdd] = useState(STEPS_PER_COIN);
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-cyan-400 mb-3">Step Simulator</h3>
      <p className="text-sm text-gray-400 mb-4">Since this is a web app, use this tool to simulate walking.</p>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={stepsToAdd}
          onChange={(e) => setStepsToAdd(parseInt(e.target.value, 10) || 0)}
          className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          onClick={() => addSteps(stepsToAdd)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Add
        </button>
      </div>
    </div>
  );
};

const FitnessTip: React.FC = () => {
    const [tip, setTip] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchTip = useCallback(async () => {
        setLoading(true);
        const newTip = await getFitnessTip();
        setTip(newTip);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchTip();
    }, [fetchTip]);

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">✨ Gemini Fitness Tip</h3>
            <p className={`text-gray-300 text-sm italic transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                {loading ? 'Generating a new tip...' : tip}
            </p>
            <button
                onClick={fetchTip}
                disabled={loading}
                className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
            >
                {loading ? 'Loading...' : 'Get New Tip'}
            </button>
        </div>
    );
};


export const HomeScreen: React.FC<HomeScreenProps> = ({ user, addSteps, claimCoin }) => {
  const [selectedCoin, setSelectedCoin] = useState<PendingCoin | null>(null);
  const [showAd, setShowAd] = useState(false);

  const handleClaimClick = (coin: PendingCoin) => {
    const today = new Date().toISOString().split('T')[0];
    if (user.dailyCoinsEarned.date === today && user.dailyCoinsEarned.count >= MAX_DAILY_COINS) {
      alert("Daily coin limit reached. Come back tomorrow!");
      return;
    }
    setSelectedCoin(coin);
  };
  
  const closeClaimModal = () => setSelectedCoin(null);

  const handleWatchAd = () => {
      if (!selectedCoin) return;
      setShowAd(true);
      closeClaimModal();
  };

  const handleAdClose = (rewarded: boolean) => {
      setShowAd(false);
      if (rewarded && selectedCoin) {
          claimCoin(selectedCoin.id);
      }
      setSelectedCoin(null);
  };
  
  const today = new Date().toISOString().split('T')[0];
  const dailyProgress = user.dailyCoinsEarned.date === today ? user.dailyCoinsEarned.count : 0;

  return (
    <div className="p-4 pb-20">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white">Hello, {user.name}</h1>
        <p className="text-gray-400">Welcome back to StepsEarn!</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center border border-gray-700">
          <span className="text-3xl font-bold text-cyan-400">{user.steps.toLocaleString()}</span>
          <span className="text-sm text-gray-400">Total Steps</span>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center border border-gray-700">
          <span className="text-3xl font-bold text-green-400">{user.walletCoins}</span>
          <span className="text-sm text-gray-400">Wallet Coins</span>
        </div>
      </div>

      <StepSimulator addSteps={addSteps} />
      <FitnessTip />

      <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Daily Coin Progress</h3>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{ width: `${(dailyProgress / MAX_DAILY_COINS) * 100}%` }}
              ></div>
          </div>
          <p className="text-right text-sm text-gray-400 mt-1">{dailyProgress} / {MAX_DAILY_COINS} coins earned today</p>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">Pending Coins ({user.pendingCoins.length})</h2>
        {user.pendingCoins.length > 0 ? (
          <div className="space-y-2">
            {user.pendingCoins.map((coin) => (
              <div key={coin.id} className="bg-gray-800 p-3 rounded-lg flex items-center justify-between shadow-md">
                <div className="flex items-center">
                  <Icon name="coin" className="w-6 h-6 text-yellow-400 mr-3" />
                  <div>
                    <p className="font-semibold text-white">+1 Coin Earned</p>
                    <p className="text-xs text-gray-400">From {STEPS_PER_COIN} steps</p>
                  </div>
                </div>
                <button
                  onClick={() => handleClaimClick(coin)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded-md text-sm transition-colors"
                >
                  Claim
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Walk {STEPS_PER_COIN} steps to earn a pending coin!</p>
        )}
      </div>

      {selectedCoin && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4">
              <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm text-center p-6 border border-gray-700">
                  <h2 className="text-xl font-bold text-yellow-400 mb-2">You earned 1 coin!</h2>
                  <p className="text-gray-300 mb-6">To add this coin to your wallet, please watch a short ad. You can skip and claim it later.</p>
                  <div className="flex justify-center space-x-4">
                      <button onClick={closeClaimModal} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-md transition-colors">Skip</button>
                      <button onClick={handleWatchAd} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-md transition-colors">Watch Ad</button>
                  </div>
              </div>
          </div>
      )}

      {showAd && <AdModal onClose={handleAdClose} />}
    </div>
  );
};