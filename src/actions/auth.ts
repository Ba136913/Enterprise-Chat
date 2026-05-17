'use server';

import { getSupabaseAdmin, supabase } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';

export async function signUpWithPhone(phoneNumber: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phoneNumber,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function verifyOtpAndSetUser(
  phoneNumber: string, 
  token: string, 
  username: string, 
  password?: string
) {
  // 1. Verify OTP
  const { data: authData, error: authError } = await supabase.auth.verifyOtp({
    phone: phoneNumber,
    token: token,
    type: 'sms',
  });

  if (authError || !authData.user) {
    return { error: authError?.message || 'Verification failed' };
  }

  const userId = authData.user.id;

  // 2. Update user profile in public.users table
  const supabaseAdmin = getSupabaseAdmin();
  
  const { error: profileError } = await supabaseAdmin
    .from('users')
    .upsert({
      id: userId,
      username: username,
      phone_number: phoneNumber,
      // Passwords are handled by Supabase Auth internally if provided later,
      // but for initial setup, we link the metadata.
    });

  if (profileError) {
    return { error: profileError.message };
  }

  // 3. Create default settings
  await supabaseAdmin.from('user_settings').insert({ user_id: userId });

  redirect('/chat');
}

export async function loginWithPassword(identifier: string, password: string) {
  // identifier can be username or phone number
  // Since Supabase Auth typically uses Email/Phone, we first resolve the phone if a username is provided.
  
  let phoneNumber = identifier;
  
  if (!identifier.startsWith('+')) {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('phone_number')
      .eq('username', identifier)
      .single();
      
    if (userError || !userData) {
      return { error: 'Invalid username or phone number' };
    }
    phoneNumber = userData.phone_number;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    phone: phoneNumber,
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/chat');
}
