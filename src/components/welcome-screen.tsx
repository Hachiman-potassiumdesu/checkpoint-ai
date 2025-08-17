'use client';

import { FileText, Bot, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WelcomeScreenProps {
  onNewChat: () => void;
}

export default function WelcomeScreen({ onNewChat }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-8 bg-background">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
             <FileText className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-headline">Welcome to ChattyPDF</CardTitle>
          <p className="text-muted-foreground pt-2">
            Start a conversation with your documents.
          </p>
        </CardHeader>
        <CardContent>
            <div className="text-center mb-8">
              <Button onClick={onNewChat} size="lg">Start New Chat</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-lg border">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-primary"/>
                    <h3 className="font-semibold mb-1">Upload Your PDF</h3>
                    <p className="text-sm text-muted-foreground">Simply upload a document to begin.</p>
                </div>
                <div className="p-4 rounded-lg border">
                    <Bot className="h-8 w-8 mx-auto mb-2 text-primary"/>
                    <h3 className="font-semibold mb-1">Ask Questions</h3>
                    <p className="text-sm text-muted-foreground">Get answers and insights from your files instantly.</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
