"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomeScreen() {
  const { user } = useAuth();
  console.log(user);
  return (
    <div className="flex flex-col ml-4">
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10 animate-in fade-in duration-500">
        <div className="flex max-w-[980px] flex-col items-start-gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking tighter sm:text-3xl md:text-5xl lg:text-6xl font-headline">
            Seamless Authentication with Sources{" "}
            <br className="hidden sm:inline" />
            for your Writing
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            Checkpoint AI provides an easy way to fact check and conduct a
            literature review for your review by finding sources from the web.
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/get-started">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
