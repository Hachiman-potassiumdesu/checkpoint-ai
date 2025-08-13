import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10 animate-in fade-in duration-500">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl font-headline">
            Seamless and Secure Authentication <br className="hidden sm:inline" />
            for your Next.js App
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            AuthFlow provides a ready-to-use authentication setup with sign-in, sign-up, and protected routes, all beautifully designed and easy to integrate.
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/signup">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
