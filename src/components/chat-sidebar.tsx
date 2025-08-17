"use client";

import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from '@/components/ui/sidebar';
import type { Chat } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { Logo } from './icons';

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
}

export default function ChatSidebar({ chats, activeChatId, onNewChat, onSelectChat }: ChatSidebarProps) {
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
           <div className="p-1.5 rounded-md bg-primary text-primary-foreground">
            <Logo className="w-6 h-6" />
           </div>
          <h1 className="text-xl font-semibold font-headline">ChattyPDF</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow p-0">
        <div className="p-2">
         <Button onClick={onNewChat} className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <SidebarMenu>
            {chats.length > 0 && <div className="px-4 pt-2 text-xs font-medium text-muted-foreground">Previous Chats</div>}
            {chats.map(chat => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  onClick={() => onSelectChat(chat.id)}
                  isActive={activeChatId === chat.id}
                  className="truncate"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="truncate">{chat.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        {/* Can add user profile or settings here */}
      </SidebarFooter>
    </>
  );
}
