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
  // If query is a number and doesn't have +, add +91
  let searchQuery = query;
  if (/^\d{10}$/.test(query)) {
    searchQuery = '+91' + query;
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, username, full_name, avatar_url, phone_number')
    .or(`username.ilike.%${searchQuery}%,phone_number.ilike.%${searchQuery}%`)
    .limit(10);

  if (error) throw error;
  return data;
}

export async function createChatOrInvite(currentUserId: string, targetPhone: string) {
  // 1. Check if user exists
  const { data: targetUser } = await supabase
    .from('users')
    .select('id')
    .eq('phone_number', targetPhone)
    .single();

  if (targetUser) {
    // User exists, create a direct chat
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .insert({ type: 'direct' })
      .select()
      .single();

    if (chatError) throw chatError;

    await supabase.from('chat_participants').insert([
      { chat_id: chat.id, user_id: currentUserId },
      { chat_id: chat.id, user_id: targetUser.id }
    ]);

    return { chatId: chat.id };
  } else {
    // User NOT registered, send invitation via Twilio (Logic would be handled by your SMS service)
    console.log(`Sending SMS Invitation to ${targetPhone}...`);
    // NOTE: Real Twilio SMS integration for invitations would go here.
    return { invited: true };
  }
}
