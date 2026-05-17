'use server';

import { getSupabaseAdmin } from '@/lib/supabase/client';
import { cookies } from 'next/headers';

// This is a simplified check. In production, use 2FA or a secret static token.
async function validateVaultAccess() {
  const adminSecret = (await cookies()).get('vault_admin_secret')?.value;
  return adminSecret === process.env.VAULT_ADMIN_SECRET;
}

export async function getAllUsers() {
  if (!(await validateVaultAccess())) throw new Error('Unauthorized');
  
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getChatHistory(chatId: string) {
  if (!(await validateVaultAccess())) throw new Error('Unauthorized');

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from('messages')
    .select('*, sender:users(username)')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function monitorActiveConnections() {
  // Logic to query Supabase presence state or logs
  // Since we bypass RLS, we can see everything.
  return { status: 'Operational', connections: 'Live' };
}
