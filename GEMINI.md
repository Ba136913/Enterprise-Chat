# Enterprise Chat Project Setup

This project is a high-end, professional chat application built with Next.js, Supabase, and Tailwind CSS.

## 🚀 Getting Started

1.  **Install Dependencies:**
    ```bash
    cd enterprise-chat
    npm install
    ```

2.  **Supabase Setup:**
    - Create a new project on [Supabase](https://supabase.com).
    - Go to the SQL Editor and paste the contents of `schema.sql`.
    - Enable **SMS Authentication** in Authentication > Providers > Phone.

3.  **Environment Variables:**
    Create a `.env.local` file in the `enterprise-chat` directory:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
    VAULT_ADMIN_SECRET=your-secret-password-for-admin
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

## 📂 Key Modules

- **Hybrid Auth:** SMS OTP + Username/Password login.
- **Core Chat:** Real-time messaging, typing indicators, and presence.
- **The Vault:** Secret admin dashboard at `/vault-admin` (God Mode).
- **WebRTC:** Foundations for voice calls (see `src/hooks/useVoiceCall.ts`).

## 🛡️ Security
- **RLS:** Row Level Security is enabled on all public tables.
- **God Mode:** The Admin panel uses the `service_role` key to bypass RLS, ensuring complete oversight without compromising client-side security.
