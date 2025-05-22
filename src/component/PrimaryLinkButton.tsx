// src/component/PrimaryLinkButton.tsx
import Link, { type LinkProps } from "next/link";
import { type ReactNode } from "react";
import clsx from "clsx";

interface PrimaryLinkButtonProps extends LinkProps {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: "primary" | "secondary" | "accent"; // Similar to Button variants
  size?: "sm" | "md" | "lg";
}

export function PrimaryLinkButton({
  children,
  className,
  id,
  variant = "primary",
  size = "md",
  ...rest
}: PrimaryLinkButtonProps) {
  let variantClasses = "";
  let sizeClasses = "px-5 py-2.5 text-sm rounded-lg"; // Default 'md' size

  if (size === "sm") {
    sizeClasses = "px-3 py-1.5 text-xs rounded-md";
  } else if (size === "lg") {
    sizeClasses = "px-6 py-3 text-base rounded-lg";
  }

  switch (variant) {
    case "primary":
      variantClasses = `
        bg-purple-600 hover:bg-purple-700 text-white
        dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-900
        font-semibold shadow-md hover:shadow-lg
      `;
      break;
    case "secondary":
      variantClasses = `
        bg-slate-200 hover:bg-slate-300 text-slate-700
        dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200
        font-medium border border-slate-300 dark:border-slate-600
      `;
      break;
    case "accent":
      variantClasses = `
        bg-cyan-500 hover:bg-cyan-600 text-slate-900
        dark:bg-purple-600 dark:hover:bg-purple-700 dark:text-white
        font-semibold shadow-md hover:shadow-lg
      `;
      break;
    default:
      variantClasses = `
        bg-purple-600 hover:bg-purple-700 text-white
        dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-900
        font-semibold shadow-md hover:shadow-lg
      `;
  }

  return (
    <Link
      id={id}
      {...rest}
      className={clsx(
        "inline-flex items-center justify-center gap-2", // For icon + text alignment if needed
        "transition-all duration-200 ease-in-out focus:outline-none",
        "focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
        variant === "primary" || variant === "accent" ? "focus:ring-purple-500 dark:focus:ring-cyan-400" : "focus:ring-slate-500 dark:focus:ring-purple-400",
        "disabled:opacity-60 disabled:cursor-not-allowed", // Links don't have a native disabled state like buttons
        sizeClasses,
        variantClasses,
        className
      )}
    >
      {children}
    </Link>
  );
}