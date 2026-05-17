'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useChatStore } from '@/lib/store';

export function useRealtime(userId: string) {
  const { addMessage, setOnlineUsers, setTyping, activeChat } = useChatStore();

  useEffect(() => {
    if (!userId) return;

    // 1. MESSAGES SUBSCRIPTION
    const messageChannel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.new.chat_id === activeChat) {
            addMessage(payload.new as any);
          }
          // Logic for notifications or updating chat list can go here
        }
      )
      .subscribe();

    // 2. PRESENCE SUBSCRIPTION (Online/Offline)
    const presenceChannel = supabase.channel('online-users');

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const newState = presenceChannel.presenceState();
        const onlineIds = Object.values(newState)
          .flat()
          .map((p: any) => p.user_id);
        setOnlineUsers(onlineIds);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('Users joined: ', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('Users left: ', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
        }
      });

    // 3. TYPING INDICATORS (Broadcast)
    const typingChannel = supabase.channel(`typing:${activeChat}`);
    
    typingChannel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        setTyping(payload.chatId, payload.userId, payload.isTyping);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(presenceChannel);
      supabase.removeChannel(typingChannel);
    };
  }, [userId, activeChat, addMessage, setOnlineUsers, setTyping]);

  const sendTypingStatus = (chatId: string, isTyping: boolean) => {
    supabase.channel(`typing:${chatId}`).send({
      type: 'broadcast',
      event: 'typing',
      payload: { chatId, userId, isTyping },
    });
  };

  return { sendTypingStatus };
}
