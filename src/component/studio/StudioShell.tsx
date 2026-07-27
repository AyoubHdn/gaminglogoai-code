import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState, type ReactNode } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCoins,
  FaColumns,
  FaDesktop,
  FaFolderOpen,
  FaGamepad,
  FaImage,
  FaPlus,
  FaSmile,
  FaTimes,
  FaUserCircle,
  FaYoutube,
} from "react-icons/fa";

import { api } from "~/utils/api";

type StudioTool = {
  id: string;
  label: string;
  shortLabel: string;
  icon: ReactNode;
  enabled: boolean;
};

type StudioToolGroup = {
  label: string;
  tools: StudioTool[];
};

const TOOL_GROUPS: StudioToolGroup[] = [
  {
    label: "Logos",
    tools: [
      {
        id: "logo",
        label: "Gaming Logo Maker",
        shortLabel: "GL",
        icon: <FaGamepad aria-hidden="true" />,
        enabled: true,
      },
      {
        id: "pfp",
        label: "PFP / Avatar Maker",
        shortLabel: "PF",
        icon: <FaUserCircle aria-hidden="true" />,
        enabled: true,
      },
    ],
  },
  {
    label: "Streaming",
    tools: [
      {
        id: "banner",
        label: "Twitch Banner Maker",
        shortLabel: "TB",
        icon: <FaImage aria-hidden="true" />,
        enabled: true,
      },
      {
        id: "panels",
        label: "Twitch Panels Maker",
        shortLabel: "TP",
        icon: <FaColumns aria-hidden="true" />,
        enabled: false,
      },
      {
        id: "screens",
        label: "Stream Screens",
        shortLabel: "SS",
        icon: <FaDesktop aria-hidden="true" />,
        enabled: false,
      },
      {
        id: "emote",
        label: "Emote Maker",
        shortLabel: "EM",
        icon: <FaSmile aria-hidden="true" />,
        enabled: false,
      },
    ],
  },
  {
    label: "Content",
    tools: [
      {
        id: "thumbnail",
        label: "YouTube Thumbnail Maker",
        shortLabel: "YT",
        icon: <FaYoutube aria-hidden="true" />,
        enabled: false,
      },
    ],
  },
];

function SidebarContent({
  collapsed,
  onCollapseToggle,
  onNavigate,
  onClose,
}: {
  collapsed: boolean;
  onCollapseToggle: () => void;
  onNavigate: () => void;
  onClose?: () => void;
}) {
  const router = useRouter();
  const selectedTool =
    typeof router.query.tool === "string" ? router.query.tool : "logo";

  const openTool = (toolId: string) => {
    const game =
      typeof router.query.game === "string" ? router.query.game : undefined;

    void router.push(
      {
        pathname: "/studio",
        query: {
          tool: toolId,
          ...(game ? { game } : {}),
        },
      },
      undefined,
      { shallow: true },
    );
    onNavigate();
  };

  return (
    <div className="flex h-full flex-col">
      <div
        className={`flex h-[68px] items-center px-4 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          aria-label="GamingLogoAI home"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-sm font-extrabold text-white shadow-md">
            G
          </span>
          {!collapsed && (
            <span className="truncate text-sm font-bold text-slate-50">
              GamingLogoAI
            </span>
          )}
        </Link>
        {!collapsed && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close Studio navigation"
          >
            <FaTimes aria-hidden="true" />
          </button>
        )}
      </div>

      <nav
        className="studio-scrollbar flex-1 space-y-4 overflow-y-auto px-2 pb-3 pt-1"
        aria-label="Studio tools"
      >
        {TOOL_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.tools.map((tool) => {
                const isActive = tool.enabled && tool.id === selectedTool;

                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={tool.enabled ? () => openTool(tool.id) : undefined}
                    disabled={!tool.enabled}
                    title={
                      collapsed
                        ? tool.enabled
                          ? tool.label
                          : `${tool.label} — coming to Studio`
                        : undefined
                    }
                    className={`group flex w-full items-center rounded-lg px-2.5 py-2 text-left transition ${
                      collapsed ? "justify-center" : "gap-3"
                    } ${
                      isActive
                        ? "bg-cyan-500 text-slate-900 shadow-md"
                        : tool.enabled
                          ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                          : "cursor-not-allowed text-slate-600"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-xs ${
                        isActive
                          ? "bg-slate-900/15"
                          : tool.enabled
                            ? "bg-slate-800"
                            : "bg-slate-800/40"
                      }`}
                    >
                      <span className="text-sm">{tool.icon}</span>
                      <span className="sr-only">{tool.shortLabel}</span>
                    </span>
                    {!collapsed && (
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold">
                          {tool.label}
                        </span>
                        {!tool.enabled && (
                          <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600">
                            Coming to Studio
                          </span>
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-2">
        <button
          type="button"
          onClick={onCollapseToggle}
          className={`hidden w-full items-center rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white lg:flex ${
            collapsed ? "justify-center" : "gap-3"
          }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <FaChevronRight aria-hidden="true" />
          ) : (
            <>
              <FaChevronLeft aria-hidden="true" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function CreditBadge() {
  const { status } = useSession();
  const creditsQuery = api.user.getCredits.useQuery(undefined, {
    enabled: status === "authenticated",
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  if (status !== "authenticated") {
    return (
      <button
        type="button"
        onClick={() =>
          void signIn("google", {
            callbackUrl:
              typeof window !== "undefined" ? window.location.href : "/studio",
          })
        }
        className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-500/20"
      >
        Sign in
      </button>
    );
  }

  const credits = creditsQuery.data;
  const isLow = typeof credits === "number" && credits < 10;
  const isEmpty = credits === 0;

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
        isEmpty
          ? "border-red-500/30 bg-red-500/10 text-red-200"
          : isLow
            ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
            : "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
      }`}
      aria-live="polite"
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isEmpty ? "bg-red-400" : isLow ? "bg-amber-400" : "bg-cyan-400"
        }`}
      />
      <span>
        {creditsQuery.isLoading || typeof credits !== "number"
          ? "— credits"
          : `${credits} credits`}
      </span>
    </div>
  );
}

export function StudioShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const requestedTool =
    typeof router.query.tool === "string" ? router.query.tool : "logo";
  const selectedTool =
    requestedTool === "pfp" || requestedTool === "banner"
      ? requestedTool
      : "logo";
  const isPfpTool = selectedTool === "pfp";
  const isBannerTool = selectedTool === "banner";

  const currentGame = useMemo(() => {
    if (typeof router.query.game !== "string") {
      return null;
    }

    const normalized = router.query.game.trim();
    return normalized
      ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
      : null;
  }, [router.query.game]);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close Studio navigation"
        />
      )}

      <aside
        className={`fixed inset-y-2 left-2 z-50 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg transition-all duration-200 ${
          collapsed ? "w-[72px]" : "w-[252px]"
        } ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-[calc(100%+24px)] lg:translate-x-0"
        }`}
      >
        <SidebarContent
          collapsed={collapsed}
          onCollapseToggle={() => setCollapsed((value) => !value)}
          onNavigate={() => setMobileOpen(false)}
          onClose={() => setMobileOpen(false)}
        />
      </aside>

      <div
        className={`min-h-screen transition-[padding] duration-200 ${
          collapsed ? "lg:pl-[88px]" : "lg:pl-[268px]"
        }`}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 lg:hidden"
              aria-label="Open Studio navigation"
            >
              {isPfpTool ? (
                <FaUserCircle aria-hidden="true" />
              ) : isBannerTool ? (
                <FaImage aria-hidden="true" />
              ) : (
                <FaGamepad aria-hidden="true" />
              )}
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                {isBannerTool ? "Streaming" : "Logos"}
              </p>
              <div className="flex min-w-0 items-center gap-2">
                <h1 className="truncate text-base font-bold text-slate-50 sm:text-lg">
                  {isPfpTool
                    ? "PFP / Avatar Maker"
                    : isBannerTool
                      ? "Twitch Banner Maker"
                      : "Gaming Logo Maker"}
                </h1>
                {currentGame && (
                  <span className="hidden rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] font-semibold text-cyan-400 sm:inline-flex">
                    {currentGame}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <CreditBadge />
            <Link
              href="/buy-credits"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500 text-slate-900 shadow-md transition hover:bg-cyan-600"
              aria-label="Buy credits"
            >
              <FaPlus aria-hidden="true" />
            </Link>
            <Link
              href="/collection"
              className="hidden items-center gap-2 rounded-lg border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-500/50 hover:bg-slate-800 hover:text-cyan-400 md:flex"
            >
              <FaFolderOpen aria-hidden="true" />
              My Designs
            </Link>
            <span className="hidden h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 sm:flex">
              <FaCoins aria-hidden="true" />
            </span>
          </div>
        </header>

        <main className="px-4 pb-10 pt-4 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
