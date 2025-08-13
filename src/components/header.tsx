'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { LogIn, LogOut, User as UserIcon, Shield } from 'lucide-react';

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2 pl-4">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold">AuthFlow</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <>
              <Button variant="ghost" onClick={() => router.push('/profile')}>
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => router.push('/get-started')}>
                <LogIn className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
