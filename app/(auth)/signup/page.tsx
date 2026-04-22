"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { Dash } from "@/components/mascot";
import { GoogleOAuthButton } from "@/components/auth/google-oauth-button";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationRequired, setConfirmationRequired] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // If Supabase is configured to require email confirmation, no session
      // is returned. Show a "check your email" screen instead of redirecting
      // to onboarding (which would just bounce back to /login).
      if (!data.session) {
        setConfirmationRequired(true);
        return;
      }

      router.push("/onboarding?new_signup=true");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (confirmationRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-4">
            <Dash emotion="happy" size="md" animate={true} />
          </div>
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Check your email</CardTitle>
              <CardDescription className="text-center">
                We sent a confirmation link to <span className="font-medium text-gray-900">{email}</span>.
                Click it to finish setting up your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 text-center">
                Didn&apos;t get it? Check your spam folder, or{" "}
                <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                  try again
                </Link>
                .
              </p>
              <div className="mt-6 text-center text-sm">
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Back to sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-4">
          <Dash
            emotion="excited"
            size="md"
            animate={true}
          />
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Let&apos;s get this permit 🔥</CardTitle>
            <CardDescription className="text-center">
              Create your account and start crushing practice questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <GoogleOAuthButton mode="signup" />
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="h-px flex-1 bg-border" />
                <span>or</span>
                <div className="h-px flex-1 bg-border" />
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Must be at least 6 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
