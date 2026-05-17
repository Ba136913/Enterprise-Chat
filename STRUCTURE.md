enterprise-chat/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth Route Group
│   │   │   ├── login/          # Phone/Username Login
│   │   │   ├── register/       # OTP + Username Setup
│   │   │   └── layout.tsx
│   │   ├── (client)/           # Main App Route Group
│   │   │   ├── chat/           # Chat Interface
│   │   │   ├── profile/        # User Settings
│   │   │   └── layout.tsx
│   │   ├── (vault-admin)/      # Secret Admin Panel (Isolated)
│   │   │   ├── vault-admin/    # Access via /vault-admin
│   │   │   └── layout.tsx
│   │   ├── api/                # API Routes (Socket, WebRTC signals)
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── auth/               # Auth specific components
│   │   ├── chat/               # Chat UI (Bubbles, Input, List)
│   │   ├── vault/              # Admin-only components
│   │   ├── shared/             # Common UI (Sidebar, Headers)
│   │   └── ui/                 # shadcn/ui base components
│   ├── hooks/                  # Custom React Hooks (useChat, usePresence)
│   ├── lib/
│   │   ├── supabase/           # Supabase Client & Admin (Service Role)
│   │   ├── socket/             # Socket.io Client setup
│   │   ├── webrtc/             # Voice call logic
│   │   ├── utils.ts            # Formatting, validation
│   │   └── store.ts            # State Management (Zustand)
│   ├── types/                  # Strict TypeScript definitions
│   ├── actions/                # Server Actions (Auth, Chat mutations)
│   └── services/               # External services (OTP, Storage)
├── public/                     # Static assets
├── .env.example                # Environment Variables template
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
