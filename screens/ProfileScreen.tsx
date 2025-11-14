
import React from 'react';
import { User } from '../types';

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout }) => {
  return (
    <div className="p-4 pb-20">
      <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6 border border-gray-700">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center text-3xl font-bold text-white mr-4">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        
        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>User ID:</span>
            <span className="font-mono text-xs bg-gray-700 px-2 py-1 rounded">{user.uid}</span>
          </div>
          <div className="flex justify-between">
            <span>Joined:</span>
            <span>-Not implemented-</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-2 text-cyan-400">Settings</h3>
        {/* Placeholder for future settings */}
        <p className="text-gray-500">More settings coming soon.</p>
      </div>


      <button
        onClick={onLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200"
      >
        Log Out
      </button>
    </div>
  );
};
