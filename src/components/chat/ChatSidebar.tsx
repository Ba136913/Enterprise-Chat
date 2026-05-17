'use client';

import { useState } from 'react';
import { useChatStore } from '@/lib/store';
import { searchUsers, createChatOrInvite } from '@/actions/chat';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatSidebar() {
  const { chats, activeChat, setActiveChat, onlineUsers, currentUser } = useChatStore();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async (val: string) => {
    setSearch(val);
    if (val.length >= 2) {
      const results = await searchUsers(val);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleCreateChat = async (targetPhone: string) => {
    if (!currentUser) return;
    const res = await createChatOrInvite(currentUser.id, targetPhone);
    if (res.chatId) {
      setActiveChat(res.chatId);
      setSearch('');
      setSearchResults([]);
    } else if (res.invited) {
      alert(`Invitation sent to ${targetPhone}!`);
    }
  };

  return (
    <div className="w-80 h-screen border-r bg-white flex flex-col shrink-0">
      {/* Sidebar Header */}
      <header className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Messages</h1>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <Plus className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search contacts..." 
            className="pl-9 bg-slate-100 border-none rounded-xl"
          />
        </div>
      </header>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="px-3 pb-6 space-y-1">
          {search.length >= 2 ? (
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Search Results</p>
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <button
                    key={user.id}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all group"
                    onClick={() => handleCreateChat(user.phone_number)}
                  >
                    <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">@{user.username}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.full_name || 'New User'}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center space-y-3">
                  <p className="text-sm text-muted-foreground">User not found.</p>
                  {/^\+91\d{10}$/.test(search) && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="rounded-full"
                      onClick={() => handleCreateChat(search)}
                    >
                      Invite {search}
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {chats.map((chat) => {
                const isActive = activeChat === chat.id;
                return (
                  <button
                    key={chat.id}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-2xl transition-all group relative",
                      isActive ? "bg-primary/5" : "hover:bg-slate-50"
                    )}
                    onClick={() => setActiveChat(chat.id)}
                  >
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />}
                    <div className="relative">
                      <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                        <AvatarFallback>C</AvatarFallback>
                      </Avatar>
                      {onlineUsers.has(chat.id) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className={cn("font-bold text-slate-800 truncate", isActive && "text-primary")}>
                          Chat Name
                        </p>
                        <span className="text-[10px] text-muted-foreground">12:45 PM</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        Last message goes here...
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
