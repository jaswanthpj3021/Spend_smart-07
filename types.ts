
export type Category = string;

export interface User {
  id: string;
  pjId: string;
  name: string;
  email: string;
  avatar?: string;
  currency: string;
  totalBudget: number;
  memberSince: string;
  settings?: {
    friendRequestNotifications: boolean;
  };
}

export interface Friend {
  id: string;
  pjId: string;
  name: string;
  email: string;
  avatar: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  senderPjId: string;
  senderName: string;
  senderEmail: string;
  receiverEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
  type: 'expense' | 'income';
  note?: string;
  imageUrl?: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: Category;
  limit: number;
  period: 'monthly' | 'weekly';
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  color: string;
  imageUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'community';
  name?: string;
  text: string;
  timestamp: string;
}

export interface PrivateMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface CustomTheme {
  id: string;
  name: string;
  bg: string;
  text: string;
  accent: string;
}

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  NEON = 'neon',
  CYBERPUNK = 'cyberpunk',
  LUXURY = 'luxury',
  ATLANTIS = 'atlantis',
  MARS = 'mars',
  LAVENDER = 'lavender',
  CUSTOM = 'custom'
}
