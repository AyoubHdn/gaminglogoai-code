// src/component/Header.tsx (or your path)
import { useState, useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./Button"; // Your themed Button
import { PrimaryLink } from "./PrimaryLink"; // Your styled Link component
import { api } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose, AiOutlineCreditCard, AiOutlineLogout, AiOutlineLogin } from "react-icons/ai";
import { FaGamepad, FaImages, FaUsers } from "react-icons/fa";
import clsx from "clsx"; // Make sure clsx is imported

export function Header() {
  const session = useSession();
  const credits = api.user.getCredits.useQuery(); // KEEPING THIS AS IS - assuming it works for gaminglogoai
  const isLoggedIn = !!session.data;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMobileMenuOpen]);

  // Navigation links for GamingLogoAI
  const commonNavLinks = [
    { href: "/gaming-logo-maker", label: "Create Logo", id: "gaming-logo-maker-header-button", icon: <FaGamepad className="mr-2 sm:mr-1 h-4 w-4" /> },
    { href: "/community", label: "Community", id: "community-header-button", icon: <FaUsers className="mr-2 sm:mr-1 h-4 w-4" /> },
  ];

  const loggedInSpecificLinks = [
    { href: "/collection", label: "My Logos", id: "collection-header-button", icon: <FaImages className="mr-2 sm:mr-1 h-4 w-4" /> },
  ];

  const navLinksToDisplay = isLoggedIn ? [...commonNavLinks, ...loggedInSpecificLinks] : commonNavLinks;


  return (
    // Header main bar: sticky, backdrop blur for modern feel
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg shadow-md">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6">
        {/* Left Section: Logo and Site Name */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Gaming Logo AI Home">
            <Image
              src="/logo.png" // ** REPLACE with GamingLogoAI's actual small logo/icon **
              alt="Gaming Logo AI Logo"
              width={36} // Slightly smaller for a cleaner look
              height={36}
              className="rounded-md transition-transform duration-300 group-hover:rotate-[-12deg] group-hover:scale-110"
            />
            <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-400 transition-colors">
              GamingLogoAI
            </span>
        </Link>

        {/* Middle Section: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-3">
            {navLinksToDisplay.map((link) => (
            // Using Next/Link directly for easier styling control here
            <Link href={link.href} key={link.id} 
                id={link.id}
                className={clsx(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                "text-slate-600 dark:text-slate-300",
                "hover:bg-slate-100 dark:hover:bg-slate-800",
                "hover:text-purple-600 dark:hover:text-cyan-400"
                )}
            >
                {link.label}
            </Link>
        ))}
        </nav>

        {/* Right Section: Actions */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
                <AiOutlineCreditCard className="h-4 w-4 text-purple-600 dark:text-cyan-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-100">
                  {credits.data ?? 0} {/* KEEPING THIS AS IS */}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Credits</span>
              </div>
              <Button
                id="buy-credits-header-button"
                variant="accent" // Use themed accent button
                size="sm"
                onClick={() => (window.location.href = "/buy-credits")} // Simple navigation
              >
                Buy Credits
              </Button>
              <Button
                id="SignOut-header-button"
                variant="ghost" // More subtle for sign out
                size="sm"
                onClick={() => { signOut().catch(console.error); }}
                className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 px-2" // Minimal padding for icon-like button
                aria-label="Sign Out"
                title="Sign Out"
              >
                <AiOutlineLogout className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button
              id="signIn-header-button"
              variant="primary" // Use themed primary button
              size="md"
              onClick={() => { signIn("google").catch(console.error); }} // Example: direct to Google
            >
              Sign In / Up
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 dark:focus:ring-cyan-500"
            aria-label="Open main menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 right-0 z-40 mx-2 mt-1 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden"
        >
          <ul className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
            {navLinksToDisplay.map((link) => (
              <li key={link.id + "-mobile"}>
                <Link href={link.href} id={`${link.id}-mobile`}
                    className="flex items-center px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-purple-600 dark:hover:text-cyan-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>
                        {link.icon} {link.label}
                </Link>
              </li>
            ))}

            <li className="border-t border-slate-200 dark:border-slate-700 pt-2 my-1"></li> {/* Separator */}

            {isLoggedIn ? (
              <>
                <li className="px-4 py-3">
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-200">
                    <div className="flex items-center gap-2">
                      <AiOutlineCreditCard className="h-5 w-5 text-purple-600 dark:text-cyan-500" />
                      <span>Credits:</span>
                      <span className="font-semibold">{credits.data ?? 0}</span> {/* KEEPING THIS AS IS */}
                    </div>
                    <Link href="/buy-credits" className="px-3 py-1 text-xs font-medium rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:hover:bg-cyan-500/30"
                        onClick={() => setIsMobileMenuOpen(false)}>
                        Get More
                    </Link>
                  </div>
                </li>
                <li>
                  <button
                    id="SignOut-header-button-mobile"
                    onClick={() => { signOut().catch(console.error); setIsMobileMenuOpen(false); }}
                    className="flex items-center w-full text-left px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <AiOutlineLogout className="mr-2 h-5 w-5" /> Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  id="signIn-header-button-mobile"
                  onClick={() => { signIn("google").catch(console.error); setIsMobileMenuOpen(false); }}
                  className="flex items-center w-full text-left px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-purple-600 dark:hover:text-cyan-400 transition-colors"
                >
                  <AiOutlineLogin className="mr-2 h-5 w-5" /> Sign In / Sign Up
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}