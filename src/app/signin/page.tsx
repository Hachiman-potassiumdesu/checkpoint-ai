import Image from "next/image"
import Link from "next/link"

import { SigninForm } from "@/components/auth/signin-form"
import { Shield } from "lucide-react"

export default function SigninPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[calc(100vh-4rem)] lg:grid-cols-2 xl:min-h-[calc(100vh-4rem)] animate-in fade-in duration-500">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Sign In</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <SigninForm />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          data-ai-hint="abstract cubes"
        />
        <div className="absolute top-8 left-8 z-20 flex items-center text-lg font-medium text-white backdrop-blur-sm bg-black/20 p-2 rounded-md">
          <Shield className="mr-2 h-6 w-6" />
          AuthFlow
        </div>
        <div className="absolute bottom-8 z-20 m-8 mt-auto text-white">
          <div className="backdrop-blur-sm bg-black/20 p-4 rounded-md">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This authentication flow is a masterpiece. It has saved me countless hours of development and frustration.&rdquo;
              </p>
              <footer className="text-sm">Satisfied Developer</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  )
}
