'use server';

import { supabase, getSupabaseAdmin } from '@/lib/supabase/client';

export async function sendMessage(chatId: string, senderId: string, content: string, mediaData?: { url: string, type: string }) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      chat_id: chatId,
      sender_id: senderId,
      content,
      media_url: mediaData?.url,
      media_type: mediaData?.type,
      expires_at: null, // Logic for 24h TTL can be added here
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function softDeleteMessage(messageId: string, userId: string, forEveryone: boolean = false) {
  const query = supabase.from('messages').update(
    forEveryone ? { is_deleted_for_everyone: true } : { is_deleted: true }
  ).eq('id', messageId);

  if (forEveryone) {
    query.eq('sender_id', userId); // Only sender can delete for everyone
  }

  const { error } = await query;
  if (error) throw error;
  return { success: true };
}

export async function getRecentChats(userId: string) {
  const { data, error } = await supabase
    .from('chat_participants')
    .select(`
      chat_id,
      chats (
        id,
        type,
        messages (
          content,
          created_at
        )
      )
    `)
    .eq('user_id', userId)
    .order('joined_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function searchUsers(query: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, full_name, avatar_url')
    .or(`username.ilike.%${query}%,phone_number.ilike.%${query}%`)
    .limit(10);

  if (error) throw error;
  return data;
}
