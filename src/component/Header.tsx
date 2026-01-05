/* eslint-disable @typescript-eslint/no-misused-promises */

import { useState, useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

import { Button } from "./Button";
import { api } from "~/utils/api";

import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineCreditCard,
  AiOutlineLogout,
  AiOutlineDown,
} from "react-icons/ai";
import { FaPaintBrush, FaTwitch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

/* ------------------------------------------------------------------ */
/* Header */
/* ------------------------------------------------------------------ */
export function Header() {
  const { data: session } = useSession();
  const credits = api.user.getCredits.useQuery();
  const isLoggedIn = !!session;
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [platformsOpen, setPlatformsOpen] = useState(false);

  const mobileRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const platformsRef = useRef<HTMLDivElement>(null);

  /* ------------------------------------------------------------------ */
  /* Close on outside click */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    function close(e: MouseEvent) {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
      if (platformsRef.current && !platformsRef.current.contains(e.target as Node)) {
        setPlatformsOpen(false);
      }
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* ------------------------------------------------------------------ */
  /* Navigation data */
  /* ------------------------------------------------------------------ */
  const toolsLinks = [
    { href: "/gaming-logo", label: "Logo Maker", icon: <FaPaintBrush /> },
    { href: "/ai-profile-picture-maker", label: "Profile Picture", icon: <CgProfile /> },
  ];

  const platformLinks = [
    {
      platform: "Twitch",
      icon: <FaTwitch className="text-purple-600" />,
      items: [
        { href: "/twitch-banner-maker", label: "Twitch Banner" },
        { href: "/twitch-panels-maker", label: "Twitch Panels" },
        { href: "/twitch-stream-screens-maker", label: "Twitch Stream Screens" },
        { href: "/twitch-emote-maker", label: "Twitch Emotes" },
      ],
    },
  ];

  const staticLinks = [
    { href: "/logo-styles", label: "Browse All Styles" },
    { href: "/community", label: "Community" },
    { href: "/buy-credits", label: "Pricing" },
    ...(isLoggedIn ? [{ href: "/collection", label: "My Designs" }] : []),
  ];

  /* ------------------------------------------------------------------ */
  /* Render */
  /* ------------------------------------------------------------------ */
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur shadow">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.webp" alt="GamingLogoAI" width={36} height={36} unoptimized />
          <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
            GamingLogoAI
          </span>
        </Link>

        {/* DESKTOP NAV (unchanged) */}
        <nav className="hidden md:flex items-center gap-2">
          {/* Tools */}
          <div className="relative" ref={toolsRef}>
            <button onClick={() => setToolsOpen(v => !v)} className="flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-purple-600">
              Tools <AiOutlineDown />
            </button>
            {toolsOpen && (
              <div className="absolute mt-2 w-64 rounded-xl bg-white dark:bg-slate-800 shadow-xl p-2">
                {toolsLinks.map(l => (
                  <Link key={l.href} href={l.href} onClick={() => setToolsOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                    <span className="text-purple-600">{l.icon}</span>
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Platforms */}
          <div className="relative" ref={platformsRef}>
            <button onClick={() => setPlatformsOpen(v => !v)} className="flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-purple-600">
              Platforms <AiOutlineDown />
            </button>
            {platformsOpen && (
              <div className="absolute mt-2 w-72 rounded-xl bg-white dark:bg-slate-800 shadow-xl p-4">
                {platformLinks.map(p => (
                  <div key={p.platform}>
                    <div className="flex items-center gap-2 mb-1 font-semibold text-sm">
                      {p.icon}
                      {p.platform}
                    </div>
                    {p.items.map(i => (
                      <Link key={i.href} href={i.href} onClick={() => setPlatformsOpen(false)} className="block px-6 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-sm">
                        {i.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {staticLinks.map(l => (
            <Link key={l.href} href={l.href} className="px-3 py-2 text-sm hover:text-purple-600">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border">
                <AiOutlineCreditCard />
                <span className="font-semibold">{credits.data ?? 0}</span>
                <span className="text-xs">Credits</span>
              </div>
              <Button size="sm" onClick={() => router.push("/buy-credits")}>
                Buy Credits
              </Button>
              <Button variant="ghost" size="sm" onClick={() => void signOut()}>
                <AiOutlineLogout />
              </Button>
            </>
          ) : (
            <Button onClick={() => void signIn("google")}>Sign In / Up</Button>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button className="md:hidden" onClick={() => setMobileOpen(v => !v)}>
          {mobileOpen ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div ref={mobileRef} className="md:hidden bg-white dark:bg-slate-900 border-t px-4 py-6 space-y-6">

          {/* CREDITS */}
          {isLoggedIn && (
            <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 border rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <AiOutlineCreditCard />
                <span className="font-semibold">{credits.data ?? 0}</span>
                <span className="text-xs">Credits</span>
              </div>
              <Link href="/buy-credits" onClick={() => setMobileOpen(false)} className="text-xs bg-purple-600 text-white px-3 py-1 rounded-md">
                Get More
              </Link>
            </div>
          )}

          {/* TOOLS */}
          <div>
            <p className="text-xs font-semibold uppercase mb-2">Tools</p>
            {toolsLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-2">
                <span className="text-purple-600">{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>

          {/* PLATFORMS */}
          <div>
            <p className="text-xs font-semibold uppercase mb-2">Platforms</p>
            {platformLinks.flatMap(p =>
              p.items.map(i => (
                <Link key={i.href} href={i.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-2">
                  {p.icon}
                  {i.label}
                </Link>
              ))
            )}
          </div>

          {/* PAGES */}
          <div>
            <p className="text-xs font-semibold uppercase mb-2">Pages</p>
            {staticLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block py-2">
                {l.label}
              </Link>
            ))}
          </div>

          {/* AUTH */}
          {isLoggedIn ? (
            <button onClick={() => { void signOut(); setMobileOpen(false); }} className="text-red-500">
              Sign Out
            </button>
          ) : (
            <button onClick={() => { void signIn("google"); setMobileOpen(false); }}>
              Sign In / Up
            </button>
          )}
        </div>
      )}
    </header>
  );
}
