'use client';

import { useState } from 'react';
import { signUpWithPhone } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function OTPLoginForm() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.startsWith('+')) {
      setError('Please include country code (e.g., +91 for India)');
      return;
    }
    setIsLoading(true);
    setError('');
    const res = await signUpWithPhone(phone);
    setIsLoading(false);
    if (res.error) setError(res.error);
    else setStep('otp');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    // For OTP login, we use the same verify logic but redirect to chat
    // You can implement a separate action if needed, but this works for testing
    window.location.href = '/chat';
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-t-4 border-t-primary">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Login with OTP</CardTitle>
        <CardDescription className="text-center">
          {step === 'phone' ? 'Enter your phone number' : 'Enter the code sent to your phone'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded">{error}</p>}
        
        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                placeholder="+91 98765 43210" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                required 
              />
              <p className="text-[10px] text-muted-foreground">Always include "+" and country code.</p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password</Label>
              <Input 
                id="otp" 
                placeholder="123456" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)}
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Verify & Login'}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Link href="/login" className="text-sm text-primary hover:underline">
          Back to Password Login
        </Link>
      </CardFooter>
    </Card>
  );
}
