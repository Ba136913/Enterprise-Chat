import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';

interface User {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  is_online: boolean;
}

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  media_url?: string;
  media_type?: string;
  created_at: string;
  is_deleted_for_everyone: boolean;
}

interface ChatState {
  currentUser: User | null;
  activeChat: string | null;
  messages: Message[];
  chats: any[];
  onlineUsers: Set<string>;
  typingUsers: Record<string, boolean>;
  
  setCurrentUser: (user: User | null) => void;
  setActiveChat: (chatId: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setChats: (chats: any[]) => void;
  setOnlineUsers: (userIds: string[]) => void;
  setTyping: (chatId: string, userId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentUser: null,
  activeChat: null,
  messages: [],
  chats: [],
  onlineUsers: new Set(),
  typingUsers: {},

  setCurrentUser: (user) => set({ currentUser: user }),
  setActiveChat: (chatId) => set({ activeChat: chatId, messages: [] }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setChats: (chats) => set({ chats }),
  setOnlineUsers: (userIds) => set({ onlineUsers: new Set(userIds) }),
  setTyping: (chatId, userId, isTyping) => set((state) => ({
    typingUsers: { ...state.typingUsers, [`${chatId}:${userId}`]: isTyping }
  })),
}));
