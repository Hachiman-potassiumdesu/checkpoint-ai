"use client";

import { Chat } from "@/lib/type";
import { useEffect, useMemo, useState } from "react";
import { Sidebar, SidebarInset, SidebarProvider } from "../ui/sidebar";
import ChatSidebar from "../chat-sidebar";
import WelcomeScreen from "../welcome-screen";
import ChatView from "../chat-view";
import { chatsCollectionRef } from "@/lib/firebase";
import { getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function AppScreen() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isNewChat, setIsNewChat] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const docRef = query(chatsCollectionRef, where("uid", "==", user?.uid));
        const data = await getDocs(docRef);

        const documents = data.docs.map(
          (doc) =>
            ({
              ...doc.data(),
            } as Chat)
        );

        setChats(documents);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: "Please try again later.",
        });
      }
    };

    loadData();
    return;
  }, []);

  const handleWelcomePage = () => {
    setActiveChatId(null);
    setIsNewChat(false);
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setIsNewChat(true);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setIsNewChat(false);
  };

  const handleChatCreated = async (newChat: Chat) => {
    setChats((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
    setIsNewChat(false);
  };

  const activeChat = useMemo(() => {
    return chats.find((chat) => chat.id === activeChatId) ?? null;
  }, [chats, activeChatId]);

  return (
    <SidebarProvider className="bg-card">
      <Sidebar collapsible="none" className="p-2">
        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onWelcomePage={handleWelcomePage}
        />
      </Sidebar>
      <SidebarInset className='overflow-x-auto'>
        <div className="flex flex-col h-full">
          {!activeChatId && !isNewChat ? (
            <div className="flex-grow flex items-center justify-center">
              <WelcomeScreen onNewChat={handleNewChat} />
            </div>
          ) : (
            <ChatView
              chat={isNewChat ? null : activeChat}
              onChatCreated={handleChatCreated}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
