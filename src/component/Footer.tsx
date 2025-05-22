// src/component/Footer.tsx
import Link from "next/link";
import { PrimaryLink } from "./PrimaryLink"; // Using your themed PrimaryLink

export function Footer() {
  const siteName = "GamingLogoAI.com"; // Brand specific
  const companySiteUrl = "https://hdnstudio.com/"; // Keep if relevant
  const companyName = "HDN STUDIO LTD";

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-4 sm:px-6 py-8 text-sm">
        <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
          <PrimaryLink href="/" className="font-semibold text-slate-700 dark:text-slate-200">
            {siteName}
          </PrimaryLink>
          <span>
            © {/*  {new Date().getFullYear()} {" "}
            <Link href={companySiteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 dark:hover:text-cyan-400 hover:underline">
                {companyName}
            </Link>*/}
            HDN STUDIO LTD. All Rights Reserved.
          </span>
        </div>
        <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
          <PrimaryLink href="/privacy-policy">Privacy Policy</PrimaryLink>
          <PrimaryLink href="/terms-of-service">Terms of Service</PrimaryLink>
          <PrimaryLink href="/refund-policy"> {/* Ensure URL matches your refund page slug */}
            Refund Policy
          </PrimaryLink>
        </nav>
      </div>
    </footer>
  );
}