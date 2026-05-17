import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Zap, MessageSquare, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <Shield className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold tracking-tighter">EnterpriseChat</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/register">
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Secure Communication for <span className="text-primary">Professionals</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl dark:text-slate-400">
                  Real-time messaging, secure voice calls, and absolute privacy. Built for the modern enterprise.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Zap className="h-10 w-10 text-primary" />
                <h2 className="text-xl font-bold">Lightning Fast</h2>
                <p className="text-slate-500">Real-time updates with Socket.io and Supabase integration.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <MessageSquare className="h-10 w-10 text-primary" />
                <h2 className="text-xl font-bold">Advanced Messaging</h2>
                <p className="text-slate-500">Typing indicators, read receipts, and self-destructing messages.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Lock className="h-10 w-10 text-primary" />
                <h2 className="text-xl font-bold">Absolute Privacy</h2>
                <p className="text-slate-500">Secure hybrid auth with OTP and encrypted credential storage.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-slate-500">© 2026 EnterpriseChat Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
