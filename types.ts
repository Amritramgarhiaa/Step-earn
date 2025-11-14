
export interface User {
  uid: string;
  email: string;
  name: string;
  steps: number;
  walletCoins: number;
  pendingCoins: PendingCoin[];
  dailyCoinsEarned: {
    date: string;
    count: number;
  };
}

export interface PendingCoin {
  id: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'withdraw_request' | 'withdraw_paid' | 'withdraw_rejected';
  amount: number;
  description: string;
  timestamp: number;
}

export interface WithdrawRequest {
    id: string;
    uid: string;
    name: string;
    email: string;
    upi: string;
    coinsRequested: number;
    status: 'pending' | 'paid' | 'rejected';
    createdAt: number;
}

export enum Screen {
  Home = 'Home',
  Wallet = 'Wallet',
  Withdraw = 'Withdraw',
  Profile = 'Profile',
}
