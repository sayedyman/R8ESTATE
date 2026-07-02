"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormData } from "@/schemas/auth.schema"
import { login } from "@/lib/auth/auth"
import { ROUTES } from "@/constants/routes"
import { useOnboardingStore } from "@/stores/onboarding-store"

import { AuthCard, AuthHeader } from "./auth-card"
import { PasswordInput } from "./password-input"
import { GoogleButton } from "./google-button"
import { LoadingButton } from "./loading-button"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const { savePreviewToPermanent } = useOnboardingStore()
  const [error, setError] = React.useState<string | null>(null)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  async function onSubmit(data: LoginFormData) {
    setError(null)
    const result = await login(data)

    if (result.error) {
      setError(result.error)
      return
    }

    if (result.user) {
      setIsSuccess(true)
      savePreviewToPermanent()
      // Small artificial delay before redirecting to show success state
      setTimeout(() => {
        router.push(callbackUrl || ROUTES.DASHBOARD)
      }, 500)
    }
  }

  return (
    <AuthCard>
      <AuthHeader 
        title="Welcome back" 
        subtitle="Sign in to your account to continue" 
      />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <Alert className="mb-6 bg-success/15 text-success border-success/20">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription>Login successful. Redirecting...</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="you@example.com" 
                    type="email" 
                    autoComplete="email" 
                    disabled={form.formState.isSubmitting || isSuccess}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link 
                    href={ROUTES.FORGOT_PASSWORD} 
                    className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput 
                    placeholder="••••••••" 
                    autoComplete="current-password"
                    disabled={form.formState.isSubmitting || isSuccess}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    disabled={form.formState.isSubmitting || isSuccess}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal cursor-pointer text-slate-600">
                    Remember me for 30 days
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <LoadingButton 
            type="submit" 
            className="w-full h-11 text-base font-semibold mt-2"
            isLoading={form.formState.isSubmitting}
            disabled={isSuccess}
          >
            {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
          </LoadingButton>
        </form>
      </Form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-500 font-medium">Or continue with</span>
        </div>
      </div>

      <GoogleButton disabled={form.formState.isSubmitting || isSuccess} />

      <p className="text-center text-sm text-slate-500 mt-8">
        Don't have an account?{" "}
        <Link 
          href={ROUTES.SIGNUP} 
          className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Create Account
        </Link>
      </p>
    </AuthCard>
  )
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
