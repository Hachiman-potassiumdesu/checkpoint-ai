"use client";

import { Chat, ChatContent, Message, Messages, Points } from "@/lib/type";
import {
  ArrowRight,
  Bot,
  FileText,
  Loader2,
  Send,
  Upload,
  User,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { ScrollArea, ScrollAreaHorizontal } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { uuidv7 } from "uuidv7";
import dayjs from "dayjs";
import { addDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { chatsCollectionRef, db, messagesCollectionRef } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";

const MODES = ["Standard", "Deep Search"];

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ChatViewProps {
  chat: Chat | null;
  onChatCreated: (chat: Chat) => void;
}

export default function ChatView({ chat, onChatCreated }: ChatViewProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [selectedMode, setSelectedMode] = useState<string>("Standard");
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [points, setPoints] = useState<Points[]>([]);
  const [messages, setMessages] = useState<Messages | null>(null);
  const [createdDate, setCreatedDate] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chat) {
      setIsLoading(true);
      setPoints(chat.messages.content);
      setCreatedDate(chat.createdAt);
      setPdfFile(null);
      setQuestion("");
      getMessages();
      setIsLoading(false);
    } else {
      setMessages(null);
      setPoints([]);
      setPdfFile(null);
      setQuestion("");
    }
  }, [chat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [points, messages]);

  const getMessages = async () => {
    try {
      const docRef = query(
        messagesCollectionRef,
        where("id", "==", chat?.id),
        where("uid", "==", user?.uid)
      );
      const data = await getDocs(docRef);

      const documents = { ...data.docs[0].data() } as Messages;

      setMessages(documents);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "Please try again later.",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setQuestion("Summarize this document.");
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a valid PDF file.",
      });
      setPdfFile(null);
    }
  };

  const handleGenerate = async () => {
    if (!pdfFile) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("mode", selectedMode);

      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        body: formData,
      });

      if (!res || !res.ok) {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try again later.",
        });

        setIsLoading(false);
        return;
      }

      const data = await res.json();

      const newPoints: Points[] = data.points.map(
        (_: string, index: number) => ({
          point: data.points[index],
          score: data.scores[index],
          explanation: data.explanations[index],
        })
      );

      const newChatContent: ChatContent = {
        content: newPoints,
        source_uri: data.source_uri,
        source_title: data.source_title,
      };

      const id = uuidv7();
      const date = dayjs().format("YYYY-MM-DD HH:mm");

      const newChat: Chat = {
        id: id,
        title: pdfFile?.name ?? id,
        mode: selectedMode,
        messages: newChatContent,
        createdAt: date,
      };

      const newMessages: Messages = {
        context: data.context,
        content: [],
        source_uri: [],
        source_title: [],
      };

      await addDoc(chatsCollectionRef, {
        ...newChat,
        uid: user?.uid,
      });

      await addDoc(messagesCollectionRef, {
        ...newMessages,
        id: id,
        uid: user?.uid,
      });

      onChatCreated(newChat);
      setPoints(newPoints);
      setMessages(newMessages);
      setCreatedDate(date);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestion = async () => {
    if (!question) return;
    if (!messages) return;
    setIsLoading(true);
    try {
      const updatedMessage: Message = {
        content: question,
        role: "user",
      };

      const updatedMessages: Messages = {
        context: messages.context,
        content: [...messages.content, updatedMessage],
        source_uri: messages.source_uri,
        source_title: messages.source_title,
      };

      setMessages(updatedMessages);

      const formData = new FormData();
      formData.append("question", question);
      formData.append("context", messages.context);

      setQuestion("");

      const res = await fetch(`${API_URL}/answer`, {
        method: "POST",
        body: formData,
      });

      if (!res || !res.ok) {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try again later.",
        });

        setIsLoading(false);
        return;
      }

      const data = await res.json();
      const docRef = query(
        messagesCollectionRef,
        where("id", "==", chat?.id),
        where("uid", "==", user?.uid)
      );

      const messagesDoc = await getDocs(docRef);
      const document = messagesDoc.docs[0];

      const newMessage: Message = {
        content: data.answer,
        role: "assistant",
      };

      console.log(messages);

      const newContentArray = [...updatedMessages.content, newMessage];
      const newUriArray = [...updatedMessages.source_uri, ...data.source_uri];
      const newTitleArray = [
        ...updatedMessages.source_title,
        ...data.source_title,
      ];

      const newMessages: Messages = {
        context: data.new_context,
        content: newContentArray,
        source_uri: newUriArray,
        source_title: newTitleArray,
      };

      await updateDoc(document.ref, {
        ...newMessages,
      });

      setMessages(newMessages);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
      setQuestion("");
    }
  };

  const isNewChat = chat === null;

  return (
    <div className="flex flex-col h-screen p-4">
      {!isNewChat && (
        <Card className="mb-4">
          <CardContent className="p-3">
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-primary" />
              <div>
                <h2 className="font-bold">{chat?.title}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{createdDate}</span>
                  <Badge variant="outline">{chat?.mode}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isNewChat ? (
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-xl">
            <CardContent className="space-y-6 p-6">
              {/* Upload Section */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-center">
                  Upload PDF to start chat
                </h3>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="hidden"
                />
                <Card
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 border-2 border-dashed hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Upload className="w-10 h-10" />
                    <p className="font-semibold">
                      {pdfFile ? (
                        <span className="text-primary truncate">
                          {pdfFile.name}
                        </span>
                      ) : (
                        "Click or drag to upload file"
                      )}
                    </p>
                    <p className="text-xs">PDF documents only</p>
                  </div>
                </Card>
              </div>

              {/* Mode Select */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-center">
                  Select Mode
                </h3>
                <div className="flex justify-center gap-2">
                  {MODES.map((mode) => (
                    <Button
                      key={mode}
                      variant={selectedMode === mode ? "default" : "outline"}
                      onClick={() => setSelectedMode(mode)}
                      className="flex-1 max-w-xs"
                    >
                      {mode}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !pdfFile}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Start Chat <ArrowRight />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable Messages inside a Card */}
          <Card className="flex flex-col flex-1 overflow-hidden">
            {/* MODIFIED: CardContent is now a flex container */}
            <CardContent className="p-4 flex flex-col h-full">
              {/* MODIFIED: ScrollArea now expands to fill available space */}
              <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="flex flex-col gap-4">
                  {points.map((point, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="flex justify-start">
                        <div
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-xl w-[90%]",
                            point.score === 0
                              ? "bg-unknown"
                              : point.score === 1
                              ? "bg-correct"
                              : "bg-incorrect"
                          )}
                        >
                          <Avatar className="w-8 h-8 border ">
                            <AvatarFallback>
                              <Bot className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="max-w-prose p-3 rounded-lg">
                            <p className="whitespace-pre-wrap">{point.point}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-card w-[90%]">
                          <p className="whitespace-pre-wrap text-md">
                            {point.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {messages &&
                    messages.content.length > 0 &&
                    messages.content.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-start gap-3",
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        )}
                      >
                        {message.role === "assistant" && (
                          <Avatar className="w-8 h-8 border">
                            <AvatarFallback>
                              <Bot className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "max-w-prose p-3 rounded-lg",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-card"
                          )}
                        >
                          <p className="whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                        {message.role === "user" && (
                          <Avatar className="w-8 h-8 border">
                            <AvatarFallback>
                              <User className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  {isLoading && (
                    <div className="flex items-start gap-3 justify-start">
                      <Avatar className="w-8 h-8 border">
                        <AvatarFallback>
                          <Bot className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="max-w-prose p-3 rounded-lg bg-card flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                    </div>
                  )}

                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              {/* START: Sources Section (now inside the CardContent) */}
              {chat?.messages.source_title &&
                chat.messages.source_title.length > 0 && (
                  <div>
                    <ScrollAreaHorizontal className="w-full [&>[data-orientation=horizontal]]:hidden">
                      <div className="flex items-center gap-2 pt-2">
                        {chat.messages.source_title.map((title, index) => (
                          <a
                            key={index}
                            href={chat.messages.source_uri[index]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="whitespace-nowrap"
                            >
                              <FileText className="h-3 w-3 mr-2" />
                              {title}
                            </Button>
                          </a>
                        ))}
                        {messages &&
                          messages.content.length > 0 &&
                          messages.source_title.map((title, index) => (
                            <a
                              key={index}
                              href={messages.source_uri[index]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="whitespace-nowrap"
                              >
                                <FileText className="h-3 w-3 mr-2" />
                                {title}
                              </Button>
                            </a>
                          ))}
                      </div>
                    </ScrollAreaHorizontal>
                  </div>
                )}
              {/* END: Sources Section */}
            </CardContent>
          </Card>

          {/* Input at Bottom in its own Card */}
          <div className="pt-4">
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a follow-up question..."
                    rows={2}
                    className="pr-24"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleQuestion}
                    disabled={isLoading || !question.trim()}
                    className="absolute right-2 bottom-2"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span className="sr-only">Generate</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
