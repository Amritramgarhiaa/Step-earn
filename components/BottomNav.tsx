
import React from 'react';
import { Screen } from '../types';
import { Icon } from './Icon';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  const navItems = [
    { screen: Screen.Home, icon: 'home', label: 'Home' },
    { screen: Screen.Wallet, icon: 'wallet', label: 'Wallet' },
    { screen: Screen.Withdraw, icon: 'withdraw', label: 'Withdraw' },
    { screen: Screen.Profile, icon: 'profile', label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.screen}
            onClick={() => setActiveScreen(item.screen)}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${
              activeScreen === item.screen ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-300'
            }`}
          >
            <Icon name={item.icon} className="w-6 h-6 mb-1" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
