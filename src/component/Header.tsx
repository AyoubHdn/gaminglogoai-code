/* eslint-disable @typescript-eslint/no-misused-promises */
// src/component/Header.tsx
import { useState, useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./Button";
import { api } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";
import {
  AiOutlineMenu, AiOutlineClose, AiOutlineCreditCard, AiOutlineLogout,
  AiOutlineLogin, AiOutlineExperiment, AiOutlineUser, AiOutlineDown, AiOutlineRight
} from "react-icons/ai";
import { FaPaintBrush, FaImages, FaUsers } from "react-icons/fa"; // Removed FaGamepad if not used directly for a top-level link
import clsx from "clsx";
import router, { useRouter } from "next/router";
import React from "react";

export function Header() {
  const session = useSession();
  const credits = api.user.getCredits.useQuery(); // <<<< YOUR ORIGINAL WORKING CREDITS QUERY
  const isLoggedIn = !!session.data; // Your original check

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGeneratorsDropdownOpen, setIsGeneratorsDropdownOpen] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const generatorsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      if (generatorsDropdownRef.current && !generatorsDropdownRef.current.contains(event.target as Node)) {
        setIsGeneratorsDropdownOpen(false);
      }
    };
    if (isMobileMenuOpen || isGeneratorsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen, isGeneratorsDropdownOpen]);

  // Links for the "Logo Generators" dropdown - pointing to LANDING PAGES
  const generatorDropdownLinks = [
    { href: "/gaming-logo", label: "Text-Based Logos", description: "Create logos from text & styles.", icon: <FaPaintBrush className="text-purple-500 dark:text-cyan-400" /> },
    { href: "/ai-profile-picture-maker", label: "Photo-To-Avatar PFPs", description: "Transform your photo into an avatar.", icon: <AiOutlineUser className="text-purple-500 dark:text-cyan-400" /> },
  ];

  // Other main navigation links
  const otherMainLinks = [
    { href: "/logo-styles", label: "Browse All Styles", id: "browse-styles-header", icon: <AiOutlineExperiment /> },
    { href: "/community", label: "Community", id: "community-header-button", icon: <FaUsers /> },
  ];

  const loggedInSpecificLinks = [
    { href: "/collection", label: "My Logos", id: "collection-header-button", icon: <FaImages /> },
  ];

  // Combine otherMainLinks with loggedInSpecificLinks if user is logged in
  const finalOtherNavLinks = isLoggedIn ? [...otherMainLinks, ...loggedInSpecificLinks] : otherMainLinks;

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg shadow-md">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6">
        {/* Left Section: Logo and Site Name */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Gaming Logo AI Home">
          <Image
            src="/logo.png" // ** YOUR GAMINGLOGOAI LOGO PATH **
            alt="Gaming Logo AI Logo"
            width={36} height={36}
            className="rounded-md transition-transform duration-300 group-hover:rotate-[-12deg] group-hover:scale-110"
          />
          <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-400 transition-colors">
            GamingLogoAI
          </span>
        </Link>

        {/* Middle Section: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-3">
          {/* Generators Dropdown */}
          <div className="relative" ref={generatorsDropdownRef}>
            <button
              onClick={() => setIsGeneratorsDropdownOpen(prev => !prev)} // Toggle on click
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-purple-600 dark:hover:text-cyan-400 transition-colors focus:outline-none"
              aria-haspopup="true"
              aria-expanded={isGeneratorsDropdownOpen}
              id="generators-menu-button"
            >
              Logo Makers <AiOutlineDown className={`ml-1 transition-transform duration-200 ${isGeneratorsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isGeneratorsDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-auto min-w-[30rem] origin-top-left rounded-lg shadow-xl bg-white dark:bg-slate-800 ring-1 ring-black dark:ring-slate-700 ring-opacity-5 focus:outline-none p-4"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="generators-menu-button" // Add an ID to the button if needed for this
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
                  {generatorDropdownLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group flex items-start p-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setIsGeneratorsDropdownOpen(false)}
                      role="menuitem"
                    >
                      <div className="flex-shrink-0 mr-4 pt-1"> {/* Icon container */}
                        {link.icon}
                      </div>
                      <div>
                        <span className="block font-semibold text-slate-700 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-400 text-base">
                          {link.label}
                        </span>
                        <span className="block text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                          {link.description}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-3">
                  <Link href="/logo-styles"
                    className="block w-full text-center px-4 py-2 text-sm text-purple-600 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium rounded-md transition-colors"
                    onClick={() => setIsGeneratorsDropdownOpen(false)}
                    role="menuitem"
                  >
                    Browse All Styles <AiOutlineRight className="inline h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Other Navigation Links */}
          {finalOtherNavLinks.map((link) => (
            <Link href={link.href} key={link.id} id={link.id}
              className={clsx(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                "text-slate-600 dark:text-slate-300",
                "hover:bg-slate-100 dark:hover:bg-slate-800",
                "hover:text-purple-600 dark:hover:text-cyan-400"
              )}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section: Actions (Credits, Buy Credits, Sign In/Out) */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
                <AiOutlineCreditCard className="h-4 w-4 text-purple-600 dark:text-cyan-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-100">
                  {credits.data ?? 0} {/* YOUR ORIGINAL CREDITS.DATA */}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Credits</span>
              </div>
              <Button id="buy-credits-header-button" variant="accent" size="sm" onClick={() => router.push("/buy-credits")}>
                Buy Credits
              </Button>
              <Button id="SignOut-header-button" variant="ghost" size="sm" onClick={() => { void signOut(); }}
                className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 px-2"
                aria-label="Sign Out" title="Sign Out">
                <AiOutlineLogout className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button id="signIn-header-button" variant="primary" size="md" onClick={() => { void signIn("google"); }}>
              Sign In / Up
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 dark:focus:ring-cyan-500"
            aria-label="Open main menu" aria-expanded={isMobileMenuOpen}>
            {isMobileMenuOpen ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden absolute top-full left-0 right-0 z-40 mx-2 mt-1 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          <ul className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
            {/* Mobile version of Generator Links */}
            <li className="px-4 py-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Logo Makers</li>
            {generatorDropdownLinks.map((link) => (
              <li key={link.href + "-mobile"}>
                <Link href={link.href} id={`${link.href.replace('/', '')}-mobile-main`} // More unique ID
                    className="flex items-center px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-purple-600 dark:hover:text-cyan-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="mr-3 h-5 w-5 flex-shrink-0">{link.icon}</span> {link.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-slate-200 dark:border-slate-700 my-1"></li>
            {/* Mobile version of Other Nav Links */}
            {finalOtherNavLinks.map((link) => (
              <li key={link.id + "-mobile-other"}>
                 <Link href={link.href} id={`${link.id}-mobile-other`}
                    className="flex items-center px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-purple-600 dark:hover:text-cyan-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>
                        {/* Clone element for icon to add classes if it's a ReactElement */}
                        {React.isValidElement(link.icon) ? React.cloneElement(link.icon as React.ReactElement, { className: "mr-3 h-5 w-5 flex-shrink-0" }) : null}
                        {link.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-slate-200 dark:border-slate-700 pt-2 my-1"></li>
            {/* Logged In/Out specific mobile links */}
            {isLoggedIn ? (
              <>
                <li className="px-4 py-3"> {/* Credits Display in Mobile */}
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-200">
                    <div className="flex items-center gap-2">
                      <AiOutlineCreditCard className="h-5 w-5 text-purple-600 dark:text-cyan-500" />
                      <span>Credits:</span>
                      <span className="font-semibold">{credits.data ?? 0}</span> {/* YOUR CREDITS.DATA */}
                    </div>
                    <Link href="/buy-credits" className="px-3 py-1 text-xs font-medium rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:hover:bg-cyan-500/30" onClick={() => setIsMobileMenuOpen(false)}>
                        Get More
                    </Link>
                  </div>
                </li>
                <li> <button id="SignOut-header-button-mobile" onClick={() => { void signOut(); setIsMobileMenuOpen(false); }} className="flex items-center w-full text-left px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-red-500 dark:hover:text-red-400 transition-colors"> <AiOutlineLogout className="mr-3 h-5 w-5 flex-shrink-0" /> Sign Out </button> </li>
              </>
            ) : (
              <li> <button id="signIn-header-button-mobile" onClick={() => { void signIn("google"); setIsMobileMenuOpen(false); }} className="flex items-center w-full text-left px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-purple-600 dark:hover:text-cyan-400 transition-colors"> <AiOutlineLogin className="mr-3 h-5 w-5 flex-shrink-0" /> Sign In / Up </button> </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}