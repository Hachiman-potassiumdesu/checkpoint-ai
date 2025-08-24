"use client";

import { signInWithPopup } from "firebase/auth";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { SiGithub, SiGoogle } from "react-icons/si";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function GetStartedScreen() {
  const { signInWithGoogle, signInWithGithub } = useAuth();
  const { toast } = useToast();

  const router = useRouter();

  const handleSignIn = async (provider: string) => {
    try {
      if (provider === "google") {
        await signInWithGoogle();
      } else if (provider === "github") {
        await signInWithGithub();
      }

      router.push('/app')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'An unknown error occurred during authentication'
      })
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[calc(100vh-4rem)] animate-in fade-in duration-500">
      <Card className="mx-auto w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Get Started</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSignIn("google")}
          >
            <SiGoogle className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSignIn("github")}
          >
            <SiGithub className="mr-2 h-5 w-5" />
            Sign in with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
