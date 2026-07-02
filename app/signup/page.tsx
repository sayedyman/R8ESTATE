import { Metadata } from "next"
import { AuthLayout } from "@/components/layout/auth-layout"
import { SignupForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Create Account | R8ESTATE",
  description: "Join R8ESTATE to build your verified professional reputation and earn client trust.",
}

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  )
}
