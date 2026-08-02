import Link from "next/link";

interface StudioPromoProps {
  toolName: string;
  href: string;
  className?: string;
}

export function StudioPromo({
  toolName,
  href,
  className = "",
}: StudioPromoProps) {
  return (
    <Link
      href={href}
      aria-label={`Open ${toolName} in Studio`}
      className={`group mx-auto my-6 flex w-[calc(100%-2rem)] max-w-5xl cursor-pointer flex-col items-center justify-between gap-4 rounded-2xl border-2 border-purple-400 bg-gradient-to-r from-purple-100 via-fuchsia-50 to-indigo-100 px-5 py-4 text-center shadow-md transition duration-200 hover:-translate-y-0.5 hover:border-purple-500 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-300 dark:border-cyan-400/70 dark:from-slate-900 dark:via-cyan-950/60 dark:to-blue-950/70 dark:hover:border-cyan-300 dark:focus-visible:ring-cyan-500/40 sm:px-6 md:flex-row md:text-left ${className}`}
    >
      <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
        Create in our all-in-one Studio — same tool, plus 6 others
      </p>
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-base font-bold text-white shadow-md transition group-hover:from-purple-700 group-hover:to-indigo-700 group-hover:shadow-lg dark:from-cyan-400 dark:to-blue-500 dark:text-slate-950 dark:group-hover:from-cyan-300 dark:group-hover:to-blue-400"
      >
        Try {toolName} in Studio ✨
      </span>
    </Link>
  );
}
