"use client";

import { useAuth } from "@/hooks/use-auth";
import { CheckCheck, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function Header() {
  const { user, logOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      router.push("/");
      await logOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {user ? (
        <div className="container flex h-14 items-center">
          <Link href="/app" className="mr-6 flex items-center space-x-2 pl-4">
            <CheckCheck className="h-6 w-6 text-primary" />
            <span className="font-bold">Checkpoint AI</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-2 mr-4">
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      ) : (
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2 pl-4">
            <CheckCheck className="h-6 w-6 text-primary" />
            <span className="font-bold">Checkpoint AI</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-2 mr-4">
            <Button variant="outline" onClick={() => router.push('/get-started')}>
              <LogIn className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
