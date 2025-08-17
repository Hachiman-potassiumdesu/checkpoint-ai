'use client';

import { useState, useMemo } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import ChatSidebar from '@/components/chat-sidebar';
import WelcomeScreen from '@/components/welcome-screen';
import ChatView from '@/components/chat-view';
import type { Chat } from '@/lib/types';

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isNewChat, setIsNewChat] = useState(false);

  const handleNewChat = () => {
    setActiveChatId(null);
    setIsNewChat(true);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setIsNewChat(false);
  };

  const handleChatCreated = (newChat: Chat) => {
    setChats(prev => [...prev, newChat]);
    setActiveChatId(newChat.id);
    setIsNewChat(false);
  };

  const activeChat = useMemo(() => {
    return chats.find(chat => chat.id === activeChatId) ?? null;
  }, [chats, activeChatId]);

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="none">
        <ChatSidebar 
          chats={chats}
          activeChatId={activeChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
        />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-svh">
          {!activeChatId && !isNewChat ? (
            <WelcomeScreen onNewChat={handleNewChat} />
          ) : (
            <ChatView chat={isNewChat ? null : activeChat} onChatCreated={handleChatCreated} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
