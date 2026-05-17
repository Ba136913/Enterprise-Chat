'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import { sendMessage } from '@/actions/chat';
import { useRealtime } from '@/hooks/useRealtime';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Paperclip, MoreVertical, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatInterface() {
  const { activeChat, messages, currentUser, onlineUsers, typingUsers } = useChatStore();
  const [input, setInput] = useState('');
  const { sendTypingStatus } = useRealtime(currentUser?.id || '');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeChat || !currentUser) return;
    
    const content = input;
    setInput('');
    sendTypingStatus(activeChat, false);
    
    try {
      await sendMessage(activeChat, currentUser.id, content);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const onInputChange = (val: string) => {
    setInput(val);
    if (activeChat) {
      sendTypingStatus(activeChat, val.length > 0);
    }
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-muted-foreground">
        <div className="w-20 h-20 rounded-full bg-slate-200 mb-4 flex items-center justify-center">
          <Send className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-600">No Chat Selected</h3>
        <p>Pick a contact to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="h-16 border-b flex items-center justify-between px-6 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10 border">
              <AvatarImage src="" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            {/* Status dot would go here */}
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Premium User</h2>
            <p className="text-xs text-green-500 font-medium">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Message List */}
      <ScrollArea className="flex-1 p-6 space-y-4 bg-slate-50/50" ref={scrollRef}>
        <div className="flex flex-col gap-4">
          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex max-w-[75%] flex-col gap-1",
                  isMe ? "self-end items-end" : "self-start items-start"
                )}
              >
                <div
                  className={cn(
                    "px-4 py-2 rounded-2xl shadow-sm text-sm",
                    isMe 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-white border text-slate-800 rounded-tl-none"
                  )}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Typing Indicator */}
      <div className="px-6 h-6 flex items-center">
        {Object.entries(typingUsers).some(([key, val]) => key.startsWith(activeChat) && val) && (
          <p className="text-[10px] text-muted-foreground italic animate-pulse">
            Someone is typing...
          </p>
        )}
      </div>

      {/* Input Area */}
      <footer className="p-4 border-t bg-white">
        <form onSubmit={handleSend} className="flex items-center gap-3 max-w-5xl mx-auto">
          <Button type="button" variant="ghost" size="icon" className="rounded-full shrink-0">
            <Paperclip className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Input 
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Type a message..."
              className="rounded-full bg-slate-100 border-none focus-visible:ring-1 pr-12 h-11"
            />
            <Button 
              type="submit"
              size="icon"
              className="absolute right-1 top-1 w-9 h-9 rounded-full"
              disabled={!input.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </footer>
    </div>
  );
}
