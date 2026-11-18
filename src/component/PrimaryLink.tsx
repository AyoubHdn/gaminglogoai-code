// src/component/PrimaryLink.tsx
import Link, { type LinkProps } from "next/link";
import { type ReactNode } from "react";
import clsx from "clsx";

interface PrimaryLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  id?: string;
  // Add any other props you might want to pass to the <a> tag if needed,
  // though usually not necessary with the new Link API.
}

export function PrimaryLink({ children, className, id, ...rest }: PrimaryLinkProps) {
  return (
    <Link
      id={id}
      {...rest} // Spreads href, scroll, etc.
      className={clsx(
        "text-slate-600 dark:text-slate-300", // Base text color
        "hover:text-purple-600 dark:hover:text-cyan-400", // Brand hover colors
        "transition-colors duration-200 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-cyan-500 rounded-sm focus:ring-offset-2 dark:focus:ring-offset-slate-900", // Focus state
        className // Allows additional classes to be passed
      )}
    >
      {children}
    </Link>
  );
}