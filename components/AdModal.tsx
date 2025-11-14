
import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

interface AdModalProps {
  onClose: (rewarded: boolean) => void;
}

export const AdModal: React.FC<AdModalProps> = ({ onClose }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Automatically close and grant reward after countdown
      onClose(true);
    }
  }, [countdown, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm text-center p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Simulating Ad</h2>
        <p className="text-gray-300 mb-4">Your reward will be ready in...</p>
        <div className="text-6xl font-mono font-bold text-white mb-6">{countdown}</div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
          <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${(5 - countdown) / 5 * 100}%` }}></div>
        </div>
        <p className="text-xs text-gray-500">This is a mock ad for demonstration. In a real app, a video from AdMob or Unity Ads would play.</p>
        <button onClick={() => onClose(false)} className="absolute top-2 right-2 text-gray-400 hover:text-white">
          <Icon name="close" className="w-6 h-6"/>
        </button>
      </div>
    </div>
  );
};
