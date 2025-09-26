// src/component/Footer.tsx
import Link from "next/link";
import Image from "next/image";
// Assuming PrimaryLink is your themed Link component that handles modern Next/Link behavior
import { PrimaryLink } from "./PrimaryLink"; 
import { FaXTwitter, FaFacebook, FaPinterest } from "react-icons/fa6"; // Import social icons

export function Footer() {
  const siteName = "GamingLogoAI.com";
  const companyName = "HDN STUDIO LTD";
  const currentYear = new Date().getFullYear();

  // Define the primary generator landing pages and tool pages
  const generators = [
    {
      name: "Text Logo Maker",
      landingUrl: "/gaming-logo", // The main "Text Logo" landing page
      toolUrl: "/gaming-logo-maker",   // The actual generator tool
    },
    {
      name: "AI PFP Maker",
      landingUrl: "/ai-profile-picture-maker", // The main "PFP" landing page
      toolUrl: "/pfp-maker",        // The actual PFP tool
    },
  ];

  // Curate a list of your most important/popular niche landing pages to feature
  const popularNiches = [
    { name: "Fortnite Logos", url: "/logo/games/fortnite-logo-maker" },
    { name: "Fortnite PFP", url: "/pfp/games/fortnite-pfp-maker" },
    { name: "Minecraft Logos", url: "/logo/games/minecraft-logo-maker" },
    { name: "Minecraft PFP", url: "/pfp/games/minecraft-pfp-maker" },
    { name: "Free Fire Logos", url: "/logo/games/free-fire-logo-maker" }, // Example URL
    //{ name: "Esports Emblems", url: "/gaming-logos/esports-emblems" }, // Example URL
    //{ name: "Valorant Logos", url: "/gaming-logos/valorant" }, // Example URL
    // Add 1-2 more if you like, but keep the list concise
  ];

  const mainLinks = [
    { name: "Browse All Styles", url: "/logo-styles" }, // The main hub page
    { name: "Community Showcase", url: "/community" },
    { name: "Pricing & Credits", url: "/buy-credits" },
    { name: "Blog", url: "/blog" },
  ];

  const companyLinks = [
    //{ name: "About Us", url: "/about" }, // If you have an About page
    { name: "Privacy Policy", url: "/privacy-policy" },
    { name: "Terms of Service", url: "/terms-of-service" },
    { name: "Refund Policy", url: "/refund-policy" },
  ];

  const socialLinks = [
    { name: "Twitter", href: "https://x.com/gaming_logo_ai", icon: <FaXTwitter /> },
    { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61580488384893", icon: <FaFacebook /> },
    { name: "Pinterest", href: "https://au.pinterest.com/gaminglogoai/", icon: <FaPinterest /> },
  ];


  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          {/* About/Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3 group w-fit">
              <Image
                src="/logo.webp" // ** REPLACE with your GamingLogoAI logo **
                alt={`${siteName} Logo`}
                width={32}
                height={32}
                className="rounded-md group-hover:scale-110 transition-transform"
                unoptimized={true} // Keep if you want to avoid Vercel optimization for this small logo
              />
              <span className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-400">{siteName}</span>
            </Link>
            <p className="text-xs leading-relaxed max-w-xs">
              Your ultimate destination for AI-powered gaming logos and custom avatars. Create stunning visuals for your team, stream, and online presence instantly.
            </p>
            <div className="flex items-center gap-4 mt-4 hidden sm:flex"> {/* Hide on xs screens if you only want them in the first column on desktop */}
              {socialLinks.map(social => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={`Follow us on ${social.name}`}
                  className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
                >
                  <span className="h-5 w-5">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Generators Column - links to LANDING pages */}
          <div>
            <h5 className="font-semibold text-sm text-slate-700 dark:text-slate-200 uppercase mb-3">Generators</h5>
            <ul className="space-y-2">
              {generators.map(gen => (
                <li key={gen.name}>
                  <PrimaryLink href={gen.toolUrl} className="text-xs hover:underline">
                    {gen.name}
                  </PrimaryLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Styles Column - links to NICHE landing pages */}
          <div>
            <h5 className="font-semibold text-sm text-slate-700 dark:text-slate-200 uppercase mb-3">Popular Styles</h5>
            <ul className="space-y-2">
              {popularNiches.map(niche => (
                <li key={niche.name}>
                  <PrimaryLink href={niche.url} className="text-xs hover:underline">
                    {niche.name}
                  </PrimaryLink>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Explore Column */}
          <div>
            <h5 className="font-semibold text-sm text-slate-700 dark:text-slate-200 uppercase mb-3">Explore</h5>
            <ul className="space-y-2">
              {mainLinks.map(link => (
                <li key={link.name}><PrimaryLink href={link.url} className="text-xs hover:underline">{link.name}</PrimaryLink></li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h5 className="font-semibold text-sm text-slate-700 dark:text-slate-200 uppercase mb-3">Company</h5>
            <ul className="space-y-2">
              {companyLinks.map(link => (
                <li key={link.name}><PrimaryLink href={link.url} className="text-xs hover:underline">{link.name}</PrimaryLink></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-8 text-center text-xs">
          <p>&copy; {currentYear} {companyName}. All Rights Reserved.</p>
          <p className="mt-1">{siteName} is a product of {companyName}.</p>
        </div>
        <div className="flex items-center justify-center mt-3 gap-4 sm:hidden"> {/* Hide on sm screens and up if you only want them in the first column on desktop */}
            {socialLinks.map(social => (
              <a 
                key={social.name} 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={`Follow us on ${social.name}`}
                className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
              >
                <span className="h-5 w-5">{social.icon}</span>
              </a>
            ))}
          </div>
      </div>
    </footer>
  );
}