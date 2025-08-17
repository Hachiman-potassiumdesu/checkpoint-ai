"use client";

import { useState, useRef, useMemo, useEffect } from 'react';
import { Upload, FileText, Loader2, Send, Bot, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from "@/hooks/use-toast"
import { generateAnswers } from '@/ai/flows/generate-answers';
import type { Chat, Message } from '@/lib/types';
import { cn } from '@/lib/utils';

const MODES = ['Concise', 'Balanced', 'Detailed'];

interface ChatViewProps {
  chat: Chat | null;
  onChatCreated: (chat: Chat) => void;
}

export default function ChatView({ chat, onChatCreated }: ChatViewProps) {
  const { toast } = useToast()
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [selectedMode, setSelectedMode] = useState<string>('Balanced');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chat) {
      setMessages(chat.messages);
      setPdfFile(null);
      setQuestion('');
    } else {
      setMessages([]);
      setPdfFile(null);
      setQuestion('');
    }
  }, [chat]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setQuestion(`Summarize this document.`);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a valid PDF file.",
      })
      setPdfFile(null);
    }
  };

  const handleGenerate = async () => {
    if (!pdfFile || !selectedMode) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please upload a PDF and select a mode.",
      })
      return;
    }

    const currentQuestion = question || `Summarize this document.`;

    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: `PDF: ${pdfFile.name}` };
    setMessages(prev => [...prev, userMessage]);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(pdfFile);
      reader.onload = async () => {
        const pdfDataUri = reader.result as string;
        const result = await generateAnswers({ pdfDataUri, question: currentQuestion, mode: selectedMode });
        const assistantMessage: Message = { role: 'assistant', content: result.answer };
        
        if (!chat) {
          const newChat: Chat = {
            id: new Date().toISOString(),
            title: pdfFile.name,
            pdfName: pdfFile.name,
            pdfDataUri,
            mode: selectedMode,
            messages: [userMessage, assistantMessage],
            createdAt: new Date(),
          };
          onChatCreated(newChat);
        } else {
           setMessages(prev => [...prev, assistantMessage]);
        }
        setQuestion('');
      };
      reader.onerror = () => {
        throw new Error("Failed to read the file.");
      }

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: errorMessage,
      })
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const isNewChat = chat === null;

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {!isNewChat && (
         <Card>
            <CardContent className="p-3">
                <div className="flex items-center gap-4">
                    <FileText className="w-6 h-6 text-primary" />
                    <div>
                        <h2 className="font-bold">{chat.title}</h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{chat.pdfName}</span>
                            <Badge variant="outline">{chat.mode}</Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
         </Card>
      )}
      <ScrollArea className="flex-grow pr-4 -mr-4">
        <div className="flex flex-col gap-4">
          {messages.map((message, index) => (
            <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : 'justify-start')}>
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8 border">
                  <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
                </Avatar>
              )}
              <div className={cn("max-w-prose p-3 rounded-lg", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card')}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <Avatar className="w-8 h-8 border">
                   <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-3 justify-start">
               <Avatar className="w-8 h-8 border">
                  <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
                </Avatar>
                <div className="max-w-prose p-3 rounded-lg bg-card flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating...</span>
                </div>
             </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="flex-shrink-0">
          <Card>
            <CardContent className="p-4 space-y-4">
              {isNewChat ? (
                <>
                <div>
                  <h3 className="text-sm font-medium mb-2 text-center">Upload PDF to start chat</h3>
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
                      <p className="font-semibold">{pdfFile ? <span className="text-primary truncate">{pdfFile.name}</span> : 'Click or drag to upload file'}</p>
                      <p className="text-xs">PDF documents only</p>
                    </div>
                  </Card>
                </div>
                 <div>
                    <h3 className="text-sm font-medium mb-2 text-center">Select Mode</h3>
                    <div className="flex justify-center gap-2">
                    {MODES.map(mode => (
                        <Button
                        key={mode}
                        variant={selectedMode === mode ? 'default' : 'outline'}
                        onClick={() => setSelectedMode(mode)}
                        className="flex-1 max-w-xs"
                        >
                        {mode}
                        </Button>
                    ))}
                    </div>
                </div>
                <Button
                    onClick={handleGenerate}
                    disabled={isLoading || !pdfFile}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Start Chat <ArrowRight /></>}
                  </Button>
                </>
              ) : (
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
                    onClick={handleGenerate}
                    disabled={isLoading || !question.trim()}
                    className="absolute right-2 bottom-2"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    <span className="sr-only">Generate</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
