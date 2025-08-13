import Link from "next/link"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="w-full flex items-center justify-center min-h-[calc(100vh-4rem)] animate-in fade-in duration-500">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold font-headline">Sign Up</h1>
          <p className="text-balance text-muted-foreground">
            Enter your information to create an account
          </p>
        </div>
        <SignupForm />
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
