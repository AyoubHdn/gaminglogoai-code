// src/component/Footer.tsx
import Link from "next/link";
import Image from "next/image"; // <<<< ENSURE THIS IMPORT IS PRESENT AND CORRECT
// Assuming PrimaryLink is updated for modern Next/Link (no legacyBehavior, className on Link)
import { PrimaryLink } from "./PrimaryLink";

export function Footer() {
  const siteName = "GamingLogoAI.com";
  const companyName = "HDN STUDIO LTD";
  const currentYear = new Date().getFullYear();

  // URLs for landing pages and tool pages
  const textLogoLandingUrl = "/gaming-logo";
  const textLogoToolUrl = "/gaming-logo-maker"; // Your actual text-to-image tool page
  const pfpLandingUrl = "/ai-profile-picture-maker";
  const pfpToolUrl = "/pfp-maker"; // Your actual image-to-image tool page
  //const stylesHubUrl = "/logo-styles";

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About/Brand Column */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3 group w-fit">
              {/* This Image component should now work if imported correctly */}
              <Image
                src="/logo.webp" // ** REPLACE with your GamingLogoAI logo **
                alt={`${siteName} Logo`}
                width={32}
                height={32}
                className="rounded-md group-hover:scale-110 transition-transform"
                unoptimized={true}
              />
              <span className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-400">{siteName}</span>
            </Link>
            <p className="text-xs leading-relaxed">
              Your ultimate destination for AI-powered gaming logos and custom avatars. Create stunning visuals for your team, stream, and online presence.
            </p>
          </div>

          {/* Generators Column - Links to TOOL pages */}
          <div>
            <h5 className="font-semibold text-sm text-slate-700 dark:text-slate-200 uppercase mb-3">Quick Tools</h5>
            <ul className="space-y-2">
              <li>
                <PrimaryLink href={textLogoToolUrl} className="text-xs hover:underline">
                  Text Logo Generator
                </PrimaryLink>
              </li>
              <li>
                <PrimaryLink href={pfpToolUrl} className="text-xs hover:underline">
                  AI PFP Maker Generator
                </PrimaryLink>
              </li>
            </ul>
          </div>

          {/* Explore Column - Links to LANDING pages / Hub */}
          <div>
            <h5 className="font-semibold text-sm text-slate-700 dark:text-slate-200 uppercase mb-3">Explore</h5>
            <ul className="space-y-2">
              {/*<li><PrimaryLink href={textLogoLandingUrl} className="text-xs hover:underline">About Text Logos</PrimaryLink></li>
              <li><PrimaryLink href={pfpLandingUrl} className="text-xs hover:underline">About AI PFPs</PrimaryLink></li>
              <li><PrimaryLink href={stylesHubUrl} className="text-xs hover:underline">Browse All Styles</PrimaryLink></li>*/}
              <li><PrimaryLink href="/community" className="text-xs hover:underline">Community</PrimaryLink></li>
              <li><PrimaryLink href="/buy-credits" className="text-xs hover:underline">Pricing</PrimaryLink></li>
              <li><PrimaryLink href="/blog" className="text-xs hover:underline">Blog</PrimaryLink></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h5 className="font-semibold text-sm text-slate-700 dark:text-slate-200 uppercase mb-3">Company</h5>
            <ul className="space-y-2">
              <li><PrimaryLink href="/privacy-policy" className="text-xs hover:underline">Privacy Policy</PrimaryLink></li>
              <li><PrimaryLink href="/terms-of-service" className="text-xs hover:underline">Terms of Service</PrimaryLink></li>
              <li><PrimaryLink href="/refund-policy" className="text-xs hover:underline">Refund Policy</PrimaryLink></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-8 text-center text-xs">
          <p>© {currentYear} {companyName}. All Rights Reserved.</p>
          <p className="mt-1">{siteName} is a product of {companyName}.</p>
        </div>
      </div>
    </footer>
  );
}