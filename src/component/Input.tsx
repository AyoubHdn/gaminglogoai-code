// src/component/Input.tsx
import React from "react";
import clsx from "clsx";

export function Input(props: React.ComponentPropsWithoutRef<"input">) {
  const { className, ...rest } = props;
  return (
    <input
      type={props.type || "text"} // Default to text if type not specified
      className={clsx(
        "w-full p-3 rounded-md shadow-sm",
        "text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500",
        "bg-white dark:bg-slate-800",
        "border border-slate-300 dark:border-slate-700",
        "focus:outline-none focus:ring-2 focus:border-transparent",
        "focus:ring-purple-500 dark:focus:ring-cyan-500",
        "disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none",
        "disabled:dark:bg-slate-800 disabled:dark:text-slate-500 disabled:dark:border-slate-700",
        className // Allow overriding or adding classes
      )}
      {...rest}
    />
  );
}