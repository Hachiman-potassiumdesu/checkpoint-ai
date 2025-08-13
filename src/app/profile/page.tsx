'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  // This should not happen due to middleware, but it's a good practice for robustness.
  if (!user) {
    return null;
  }

  const getInitials = (email: string | null) => {
    if (!email) return 'U';
    const names = email.split('@')[0];
    return names.substring(0, 2).toUpperCase();
  };

  return (
    <div className="container flex items-center justify-center py-12 animate-in fade-in duration-500">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="items-center text-center p-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.photoURL ?? ''} alt="User avatar" />
            <AvatarFallback className="text-3xl">{getInitials(user.email)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-headline">Welcome back!</CardTitle>
          <CardDescription>
            This is your personal profile page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Email Address</p>
            <p className="font-mono text-sm p-3 bg-muted rounded-md">{user.email}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">User ID</p>
            <p className="font-mono text-sm p-3 bg-muted rounded-md break-all">{user.uid}</p>
          </div>
        </CardContent>
        <CardFooter className="p-6">
          <Button onClick={handleSignOut} className="w-full" variant="destructive">
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
