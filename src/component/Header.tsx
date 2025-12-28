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
import {
  FaPaintBrush,
  //FaImages,
  FaTwitch,
  //FaYoutube,
  //FaDiscord,
  //FaLayerGroup,
} from "react-icons/fa";
import { CgProfile
} from "react-icons/cg";

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
    //{ href: "/twitch-banner-maker", label: "Banner Maker", icon: <FaImages /> },
    //{ href: "/twitch-panels-generator", label: "Panels", icon: <FaLayerGroup /> },
  ];

  const platformLinks = [
    {
      platform: "Twitch",
      icon: <FaTwitch className="text-purple-600" />,
      items: [
        { href: "/twitch-banner-maker", label: "Twitch Banner" },
        { href: "/twitch-panels-maker", label: "Twitch Panels" },
      ],
    },
    /*{
      platform: "YouTube",
      icon: <FaYoutube className="text-red-600" />,
      items: [{ href: "#", label: "Coming Soon" }],
    },
    {
      platform: "Discord",
      icon: <FaDiscord className="text-indigo-500" />,
      items: [{ href: "#", label: "Coming Soon" }],
    },*/
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

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-2">

          {/* TOOLS */}
          <div className="relative" ref={toolsRef}>
            <button
              onClick={() => setToolsOpen(v => !v)}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-purple-600"
            >
              Tools <AiOutlineDown />
            </button>
            {toolsOpen && (
              <div className="absolute mt-2 w-64 rounded-xl bg-white dark:bg-slate-800 shadow-xl p-2">
                {toolsLinks.map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setToolsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <span className="text-purple-600">{l.icon}</span>
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* PLATFORMS */}
          <div className="relative" ref={platformsRef}>
            <button
              onClick={() => setPlatformsOpen(v => !v)}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-purple-600"
            >
              Platforms <AiOutlineDown />
            </button>
            {platformsOpen && (
              <div className="absolute mt-2 w-72 rounded-xl bg-white dark:bg-slate-800 shadow-xl p-4">
                {platformLinks.map(p => (
                  <div key={p.platform} className="mb-4">
                    <div className="flex items-center gap-2 mb-1 text-sm font-semibold">
                      {p.icon}
                      {p.platform}
                    </div>
                    {p.items.map(i => (
                      <Link
                        key={i.label}
                        href={i.href}
                        onClick={() => setPlatformsOpen(false)}
                        className="block px-6 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-sm"
                      >
                        {i.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STATIC LINKS */}
          <Link href="/logo-styles" className="px-3 py-2 text-sm hover:text-purple-600">
            Browse All Styles
          </Link>

          <Link href="/community" className="px-3 py-2 text-sm hover:text-purple-600">
            Community
          </Link>

          <Link href="/buy-credits" className="px-3 py-2 text-sm hover:text-purple-600">
            Pricing
          </Link>

          {isLoggedIn && (
            <Link href="/collection" className="px-3 py-2 text-sm hover:text-purple-600">
              My Designs
            </Link>
          )}
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

          {isLoggedIn && (
            <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 border rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <AiOutlineCreditCard />
                <span className="font-semibold">{credits.data ?? 0}</span>
                <span className="text-xs">Credits</span>
              </div>
              <Link
                href="/buy-credits"
                onClick={() => setMobileOpen(false)}
                className="text-xs bg-purple-600 text-white px-3 py-1 rounded-md"
              >
                Get More
              </Link>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase mb-2">Tools</p>
            {toolsLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-2">
                <span className="text-purple-600">{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase mb-2">Platforms</p>
            {platformLinks.map(p =>
              p.items.map(i => (
                <Link key={`${p.platform}-${i.label}`} href={i.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-2">
                  {p.icon}
                  {i.label}
                </Link>
              ))
            )}
          </div>

          <Link href="/logo-styles" onClick={() => setMobileOpen(false)}>Browse All Styles</Link>
          <Link href="/community" onClick={() => setMobileOpen(false)}>Community</Link>
          <Link href="/buy-credits" onClick={() => setMobileOpen(false)}>Pricing</Link>
          {isLoggedIn && <Link href="/collection" onClick={() => setMobileOpen(false)}>My Designs</Link>}

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
