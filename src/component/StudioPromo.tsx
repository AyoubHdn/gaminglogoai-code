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
    <aside
      aria-label={`Open ${toolName} in Studio`}
      className={`mx-auto my-6 flex w-[calc(100%-2rem)] max-w-4xl flex-col items-center justify-between gap-3 rounded-xl border border-purple-200 bg-purple-50/90 px-4 py-3 text-center shadow-sm dark:border-cyan-500/30 dark:bg-slate-900/90 sm:px-5 md:flex-row md:text-left ${className}`}
    >
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Create in our all-in-one Studio — same tool, plus 6 others
      </p>
      <Link
        href={href}
        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 dark:from-cyan-400 dark:to-blue-500 dark:text-slate-950 dark:hover:from-cyan-300 dark:hover:to-blue-400 dark:focus:ring-cyan-400 dark:focus:ring-offset-slate-950"
      >
        Try {toolName} in Studio ✨
      </Link>
    </aside>
  );
}
