"use client";

import * as React from "react";
import {
  Sparkles,
  Lock,
  Mail,
  KeyRound,
  User,
  AlertCircle,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/supabase/auth-context";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  title = "Sign In Required to Order",
  description = "Please log in or register to link your bespoke nail design, confirm sizes, and place your order.",
}: AuthModalProps) {
  const {
    user,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendGmailOtp,
    signInWithOtpCode,
    signInDemoUser,
  } = useAuth();

  const [mode, setMode] = React.useState<"login" | "signup" | "otp">("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");
  const [isOtpSent, setIsOtpSent] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  // Close and trigger callback when user becomes authenticated
  React.useEffect(() => {
    if (user && isOpen) {
      setSuccessMsg("Logged in successfully.");
      const timer = setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, isOpen, onSuccess, onClose]);

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in email and password.");
      return;
    }

    try {
      setIsLoading(true);
      if (mode === "signup") {
        if (!fullName.trim()) {
          setErrorMsg("Please enter your name.");
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg("Password must be at least 6 characters.");
          setIsLoading(false);
          return;
        }
        const { error } = await signUpWithEmail(email, password, fullName);
        if (error) {
          setErrorMsg(error);
        } else {
          setSuccessMsg("Account created! Redirecting...");
          onSuccess?.();
          setTimeout(() => onClose(), 800);
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMsg(error);
        } else {
          setSuccessMsg("Welcome back! Continuing...");
          onSuccess?.();
          setTimeout(() => onClose(), 800);
        }
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await sendGmailOtp(email, fullName);
      if (error) {
        setErrorMsg(error);
      } else {
        setIsOtpSent(true);
        setSuccessMsg(`We sent a 6-digit code to ${email}!`);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!otpCode || otpCode.trim().length < 6) {
      setErrorMsg("Please enter the 6-digit verification code.");
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await signInWithOtpCode(email, otpCode, fullName);
      if (error) {
        setErrorMsg(error);
      } else {
        setSuccessMsg("Verified! Continuing with your order...");
        onSuccess?.();
        setTimeout(() => onClose(), 800);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsLoading(false);
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
        onSuccess?.();
        setTimeout(() => onClose(), 800);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Google sign-in error");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleDemoLogin = () => {
    signInDemoUser();
    setSuccessMsg("Logged in with Demo VIP account!");
    onSuccess?.();
    setTimeout(() => onClose(), 600);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className="text-center mb-5">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary-light dark:bg-brand-primary/20 text-brand-primary mb-3 shadow-pink-sm">
          <Lock className="h-6 w-6" />
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-brand-dark-muted mt-1 max-w-sm mx-auto">
          {description}
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-pink-100/70 dark:bg-brand-dark-card rounded-2xl border border-pink-200 dark:border-brand-dark-border mb-4">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            mode === "login"
              ? "bg-white dark:bg-brand-primary text-brand-primary dark:text-white shadow-sm"
              : "text-gray-600 dark:text-brand-dark-muted hover:text-brand-primary"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            mode === "signup"
              ? "bg-white dark:bg-brand-primary text-brand-primary dark:text-white shadow-sm"
              : "text-gray-600 dark:text-brand-dark-muted hover:text-brand-primary"
          }`}
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("otp");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            mode === "otp"
              ? "bg-white dark:bg-brand-primary text-brand-primary dark:text-white shadow-sm"
              : "text-gray-600 dark:text-brand-dark-muted hover:text-brand-primary"
          }`}
        >
          Email Code
        </button>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-600 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Forms */}
      {mode === "otp" ? (
        !isOtpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <Input
              id="modal-otp-name"
              label="Full Name (Optional)"
              placeholder="e.g. Ariana Grande"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              id="modal-otp-email"
              type="email"
              label="Your Gmail / Email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-11 text-sm shadow-pink-md gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Send 6-Digit Code</span>
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <div className="text-center">
              <span className="text-xs text-gray-500">Sent code to: <strong>{email}</strong></span>
            </div>
            <Input
              id="modal-otp-code"
              type="text"
              label="Enter 6-Digit Code"
              placeholder="123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
            />
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-11 text-sm shadow-pink-md gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Verify & Continue Order</span>
            </Button>
            <button
              type="button"
              onClick={() => setIsOtpSent(false)}
              className="text-xs text-brand-primary hover:underline block mx-auto pt-1"
            >
              Change Email
            </button>
          </form>
        )
      ) : (
        <form onSubmit={handlePasswordAuth} className="space-y-3">
          {mode === "signup" && (
            <Input
              id="modal-auth-name"
              label="Your Full Name"
              placeholder="e.g. Ariana Grande"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <Input
            id="modal-auth-email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="modal-auth-pass"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full h-11 text-sm shadow-pink-md gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{mode === "signup" ? "Create Account & Order" : "Log In & Continue"}</span>
          </Button>
        </form>
      )}

      {/* Divider */}
      <div className="relative my-4 flex items-center">
        <div className="flex-grow border-t border-pink-200 dark:border-brand-dark-border" />
        <span className="mx-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          or quick sign-in
        </span>
        <div className="flex-grow border-t border-pink-200 dark:border-brand-dark-border" />
      </div>

      {/* Quick Google and Demo options */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleAuth}
          isLoading={isGoogleLoading}
          className="h-10 text-xs font-bold gap-1.5 border-pink-200 dark:border-brand-dark-border"
        >
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
          <span>Google</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleDemoLogin}
          className="h-10 text-xs font-bold gap-1.5 border-pink-200 dark:border-brand-dark-border bg-pink-50/50 dark:bg-brand-primary/10 text-brand-primary"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Demo VIP</span>
        </Button>
      </div>
    </Dialog>
  );
}
