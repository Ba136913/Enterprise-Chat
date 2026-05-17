-- ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    phone_number TEXT UNIQUE,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    -- NOTE: In Supabase, the actual authentication password is securely stored in `auth.users`.
    -- For the custom hybrid auth logic, we will rely on Supabase Auth's native Phone/Password provider.
    is_online BOOLEAN DEFAULT FALSE,
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SETTINGS TABLE
CREATE TABLE public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    read_receipts BOOLEAN DEFAULT TRUE,
    typing_indicators BOOLEAN DEFAULT TRUE,
    theme TEXT DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CHATS (Conversations) TABLE
CREATE TABLE public.chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('direct', 'group')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CHAT PARTICIPANTS TABLE
CREATE TABLE public.chat_participants (
    chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (chat_id, user_id)
);

-- 5. MESSAGES TABLE
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT,
    media_url TEXT,
    media_type TEXT, -- e.g., 'image', 'video', 'audio', 'document'
    is_deleted BOOLEAN DEFAULT FALSE, -- Delete for me
    is_deleted_for_everyone BOOLEAN DEFAULT FALSE, -- Delete for everyone
    expires_at TIMESTAMPTZ, -- Support for 24h TTL Self-Destructing Messages
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MESSAGE READ RECEIPTS (Blue Ticks)
CREATE TABLE public.message_reads (
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (message_id, user_id)
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- 🔥 GOD MODE BYPASS: 
-- Supabase automatically bypasses RLS for any request made using the `service_role` key.
-- The Admin Panel (Vault) MUST use the `service_role` key (via Supabase Admin Client) 
-- to have unrestricted read/write access to all tables without needing specific RLS policies.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reads ENABLE ROW LEVEL SECURITY;

-- Users RLS
CREATE POLICY "Users can read all profiles" 
ON public.users FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE USING (auth.uid() = id);

-- Settings RLS
CREATE POLICY "Users can manage their own settings" 
ON public.user_settings FOR ALL USING (auth.uid() = user_id);

-- Chats & Participants RLS
CREATE POLICY "Users can view chats they are part of" 
ON public.chats FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.chat_participants 
    WHERE chat_id = public.chats.id AND user_id = auth.uid()
));

CREATE POLICY "Users can view chat participants in their chats" 
ON public.chat_participants FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.chat_participants as cp
    WHERE cp.chat_id = public.chat_participants.chat_id AND cp.user_id = auth.uid()
));

-- Messages RLS
CREATE POLICY "Users can view messages in their chats (if not expired/deleted)" 
ON public.messages FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.chat_participants 
        WHERE chat_id = public.messages.chat_id AND user_id = auth.uid()
    ) 
    AND (is_deleted_for_everyone = false)
    AND (expires_at IS NULL OR expires_at > NOW())
);

CREATE POLICY "Users can insert messages in their chats" 
ON public.messages FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.chat_participants 
        WHERE chat_id = public.messages.chat_id AND user_id = auth.uid()
    )
    AND sender_id = auth.uid()
);

CREATE POLICY "Users can soft-delete their own messages" 
ON public.messages FOR UPDATE 
USING (sender_id = auth.uid());

-- Triggers for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
