import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "white";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none";

    const variants = {
      primary:
        "bg-brand-primary text-white hover:bg-brand-primary-hover shadow-pink-sm hover:shadow-pink-md border border-transparent",
      secondary:
        "bg-brand-primary-light text-brand-primary hover:bg-pink-200 border border-brand-border",
      outline:
        "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white bg-transparent",
      ghost:
        "text-brand-text hover:text-brand-primary hover:bg-brand-primary-light/50",
      link: "text-brand-primary underline-offset-4 hover:underline p-0 h-auto",
      white:
        "bg-white text-brand-primary hover:bg-pink-50 shadow-sm border border-pink-100",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs font-semibold tracking-wide",
      md: "h-11 px-6 text-sm font-semibold tracking-wide",
      lg: "h-13 px-8 text-base font-bold tracking-wide shadow-pink-md",
      icon: "h-10 w-10 p-0 rounded-full",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
