"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Mail,
  KeyRound,
  Sparkle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/supabase/auth-context";

export default function AuthPage() {
  const router = useRouter();
  const {
    user,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendGmailOtp,
    signInWithOtpCode,
  } = useAuth();

  const [mode, setMode] = React.useState<"login" | "gmail_otp" | "signup">("gmail_otp");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  // OTP state
  const [otpCode, setOtpCode] = React.useState("");
  const [isOtpSent, setIsOtpSent] = React.useState(false);
  const [isSendingOtp, setIsSendingOtp] = React.useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (mode === "signup") {
      if (!fullName) {
        setErrorMsg("Please enter your full name.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
    }

    try {
      setIsLoading(true);
      if (mode === "signup") {
        const { error } = await signUpWithEmail(email, password, fullName);
        if (error) {
          setErrorMsg(error);
        } else {
          setSuccessMsg("Account created successfully! Redirecting...");
          setTimeout(() => router.push("/dashboard"), 1000);
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMsg(error);
        } else {
          setSuccessMsg("Welcome back! Redirecting...");
          setTimeout(() => router.push("/dashboard"), 800);
        }
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendGmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid Gmail / Email address.");
      return;
    }

    try {
      setIsSendingOtp(true);
      const { error } = await sendGmailOtp(email, fullName);
      if (error) {
        setErrorMsg(error);
      } else {
        setIsOtpSent(true);
        setSuccessMsg(`We sent a 6-digit verification code to ${email}! Check your inbox.`);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to send code via Gmail");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!otpCode || otpCode.trim().length < 6) {
      setErrorMsg("Please enter the 6-digit code sent to your Gmail.");
      return;
    }

    try {
      setIsVerifyingOtp(true);
      const { error } = await signInWithOtpCode(email, otpCode, fullName);
      if (error) {
        setErrorMsg(error);
      } else {
        setSuccessMsg("Verification successful! Welcome to ShineDe Nails.");
        setTimeout(() => router.push("/dashboard"), 1000);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Verification error");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      setIsGoogleLoading(true);
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg(error);
      } else {
        setSuccessMsg("Connecting with Google...");
        setTimeout(() => router.push("/dashboard"), 1000);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Google sign-in error");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-dark-bg subtle-sparkle-bg flex items-center justify-center py-10 px-4 sm:px-6 transition-colors">
      <div className="w-full max-w-md space-y-6">
        {/* Main Card */}
        <div className="rounded-4xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-7 sm:p-9 shadow-pink-md dark:shadow-dark-card transition-all">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary-light dark:bg-brand-primary/20 text-brand-primary mb-3 shadow-pink-sm">
              <Sparkles className="h-7 w-7" />
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {mode === "gmail_otp"
                ? "Gmail Instant Verification"
                : mode === "login"
                ? "Welcome Back to ShineDe"
                : "Join ShineDe Nails"}
            </h1>
            <p className="text-xs text-brand-primary font-bold uppercase tracking-widest mt-1">
              Handcrafted Press-On Studio · Kathmandu
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-pink-100/70 dark:bg-brand-dark-card rounded-2xl border border-pink-200 dark:border-brand-dark-border mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("gmail_otp");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
                mode === "gmail_otp"
                  ? "bg-white dark:bg-brand-primary text-brand-primary dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-brand-dark-muted hover:text-brand-primary"
              }`}
            >
              Gmail Code
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
                mode === "login"
                  ? "bg-white dark:bg-brand-primary text-brand-primary dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-brand-dark-muted hover:text-brand-primary"
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
                mode === "signup"
                  ? "bg-white dark:bg-brand-primary text-brand-primary dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-brand-dark-muted hover:text-brand-primary"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-full border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card py-3 px-4 text-xs sm:text-sm font-bold text-gray-800 dark:text-brand-dark-text hover:bg-pink-50 dark:hover:bg-brand-dark-surface hover:border-brand-primary dark:hover:border-brand-primary transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-brand-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google Account</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pink-100 dark:border-brand-dark-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-brand-dark-surface px-3 text-gray-400 dark:text-brand-dark-muted font-semibold tracking-wider">
                {mode === "gmail_otp" ? "Or Instant Gmail Code" : "Or with Credentials"}
              </span>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE 1: GMAIL OTP CODE LOGIN / VERIFICATION */}
          {mode === "gmail_otp" && (
            <div className="space-y-4 text-left">
              {!isOtpSent ? (
                <form onSubmit={handleSendGmailOtp} className="space-y-4">
                  <Input
                    type="email"
                    label="Your Gmail / Email Address"
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    isLoading={isSendingOtp}
                    className="w-full h-12 shadow-pink-md gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Send Verification Code via Gmail</span>
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-1">
                      Enter 6-Digit Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="123456"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        className="w-full text-center tracking-[0.5em] text-2xl font-mono font-bold rounded-2xl border border-brand-primary/50 bg-pink-50/40 dark:bg-brand-dark-card py-3 text-brand-primary focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-inner"
                        required
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-gray-500 dark:text-brand-dark-muted truncate max-w-[180px]">
                        Sent to {email}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOtpSent(false);
                          setOtpCode("");
                          setErrorMsg("");
                        }}
                        className="text-brand-primary font-bold hover:underline"
                      >
                        Change Email
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    isLoading={isVerifyingOtp}
                    className="w-full h-12 shadow-pink-md gap-2"
                  >
                    <KeyRound className="h-4 w-4" />
                    <span>Verify Code & Sign In</span>
                  </Button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      disabled={isSendingOtp}
                      onClick={handleSendGmailOtp}
                      className="text-xs font-bold text-gray-500 dark:text-brand-dark-muted hover:text-brand-primary transition-colors"
                    >
                      {isSendingOtp ? "Resending..." : "Didn't receive it? Click to resend"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* MODE 2 & 3: PASSWORD LOGIN & SIGN UP */}
          {(mode === "login" || mode === "signup") && (
            <form onSubmit={handlePasswordAuth} className="space-y-4 text-left">
              {mode === "signup" && (
                <Input
                  label="Full Name"
                  placeholder="e.g. Maya Shrestha"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              )}

              <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-9 text-gray-400 hover:text-brand-primary"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {mode === "signup" && (
                <Input
                  type="password"
                  label="Confirm Password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full mt-2 h-12 shadow-pink-md gap-2"
              >
                <span>{mode === "login" ? "Sign In to ShineDe" : "Create My Account"}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* Switch mode hint */}
          <div className="mt-5 text-center text-xs text-gray-600 dark:text-brand-dark-muted">
            {mode === "login" && (
              <p>
                Want code-based instant login?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("gmail_otp");
                    setErrorMsg("");
                  }}
                  className="font-bold text-brand-primary hover:underline"
                >
                  Use Gmail OTP
                </button>
              </p>
            )}
            {mode === "gmail_otp" && (
              <p>
                Prefer password login?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                  }}
                  className="font-bold text-brand-primary hover:underline"
                >
                  Sign In with Password
                </button>
              </p>
            )}
            {mode === "signup" && (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                  }}
                  className="font-bold text-brand-primary hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Brand Guarantee footer note */}
        <p className="text-center text-xs text-gray-500 dark:text-brand-dark-muted flex items-center justify-center gap-1.5">
          <Sparkle className="w-3 h-3 text-brand-primary" />
          <span>Save your custom millimeter sizes & track custom sets across Nepal.</span>
        </p>
      </div>
    </div>
  );
}
