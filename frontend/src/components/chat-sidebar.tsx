"use client";

import { Chat } from "@/lib/type";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Button } from "./ui/button";
import { CheckCheck, LogOut, MessageSquare, Plus } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onWelcomePage: () => void;
}

export default function ChatSidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onWelcomePage,
}: ChatSidebarProps) {
  const { user, logOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      //   router.push("/");
      await logOut();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <SidebarHeader className='border-b-2'>
        <div className="flex items-center gap-2">
          <Button
            onClick={onWelcomePage}
            variant="noHover"
            className="flex items-center bg-transparent px-0"
          >
            <div className="p-1.5 rounded-md bg-primary text-primary-foreground">
              <CheckCheck className="h-6 w-6" />
            </div>
            <h1 className="text-[1.1rem] font-semibold font-headline">
              Checkpoint AI
            </h1>
          </Button>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow p-0">
        <div className="p-2">
          <Button onClick={onNewChat} className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
        <ScrollArea className="h-full">
          <SidebarMenu>
            {chats.length > 0 && (
              <div className="px-4 text-xs font-medium text-muted-foreground">
                Previous Chats
              </div>
            )}
            {chats.map((chat) => (
              <SidebarMenuItem
                key={chat.id}
                className={cn(
                  "rounded-md",
                  activeChatId === chat.id &&
                    "bg-secondary text-secondary-foreground"
                )}
              >
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
    </>
  );
}
