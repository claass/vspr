"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TextFieldVariant = "filled" | "glass";

type BaseProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">;

export interface TextFieldProps extends BaseProps {
  label?: string;
  hint?: string;
  error?: string;
  variant?: TextFieldVariant;
}

const variantStyles: Record<TextFieldVariant, string> = {
  filled:
    "bg-[rgba(17,25,38,0.68)] focus-within:bg-[rgba(23,33,50,0.78)] border border-[rgba(255,255,255,0.08)]",
  glass: "glass-s1 border border-[color:var(--color-stroke)]",
};

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ id, label, hint, error, className, variant = "glass", ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
    return (
      <label className="flex w-full flex-col gap-xs text-arcana-text-low">
        {label && (
          <span className="text-sm font-medium tracking-wide text-arcana-text-high">
            {label}
          </span>
        )}
        <div
          className={cn(
            "relative flex h-12 items-center rounded-control-m px-sm text-arcana-text-high transition-all",
            "duration-160 ease-[var(--motion-ease-standard)] focus-within:outline focus-within:outline-2",
            "focus-within:outline-offset-2 focus-within:outline-[color:var(--color-accent)]",
            variantStyles[variant],
            error && "border border-[rgba(247,178,91,0.6)]",
            className
          )}
        >
          <input
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className="w-full bg-transparent text-sm font-medium text-arcana-text-high placeholder:text-arcana-text-low focus:outline-none"
            {...props}
          />
        </div>
        {hint && !error && (
          <span id={`${inputId}-hint`} className="text-xs text-arcana-text-low">
            {hint}
          </span>
        )}
        {error && (
          <span id={`${inputId}-error`} className="text-xs text-[color:var(--color-warning)]">
            {error}
          </span>
        )}
      </label>
    );
  }
);

TextField.displayName = "TextField";

interface SearchFieldProps extends Omit<TextFieldProps, "type"> {}

const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        type="search"
        label={props.label ?? "Search"}
        placeholder={props.placeholder ?? "Search arcana"}
        className={cn("pr-12", className)}
        {...props}
      />
    );
  }
);

SearchField.displayName = "SearchField";

export function TextFieldExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-sm">
      <TextField label="Sigil name" placeholder="Aurelia" hint="Visible to your circle." />
      <TextField variant="filled" label="Cipher" placeholder="••••" error="Incorrect key" />
      <SearchField />
    </div>
  );
}
