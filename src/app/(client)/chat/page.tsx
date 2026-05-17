'use client';

import { useChatStore } from '@/lib/store';
import { useRealtime } from '@/hooks/useRealtime';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  const { currentUser } = useChatStore();
  
  // Initialize Realtime engine
  useRealtime(currentUser?.id || '');

  return (
    <main className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Contacts & Conversations */}
      <ChatSidebar />

      {/* Main Chat Area */}
      <ChatInterface />
    </main>
  );
}
