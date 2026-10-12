import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold tracking-wider uppercase text-gray-700 dark:text-brand-dark-muted"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          className={cn(
            "flex h-12 w-full rounded-2xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card px-4 py-2 text-sm text-brand-text dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 shadow-sm",
            error && "border-red-500 focus:border-red-500 focus:ring-red-200",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-medium pl-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
