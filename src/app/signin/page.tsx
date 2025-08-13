import Link from "next/link"

import { SigninForm } from "@/components/auth/signin-form"

export default function SigninPage() {
  return (
    <div className="w-full flex items-center justify-center min-h-[calc(100vh-4rem)] animate-in fade-in duration-500">
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
  )
}
