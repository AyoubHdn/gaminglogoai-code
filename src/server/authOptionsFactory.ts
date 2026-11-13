import GoogleProvider from "next-auth/providers/google";
import type { Adapter } from "next-auth/adapters";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import type { GamingAuthProfile } from "./authDbService";

const googleProviderFactory = (() => {
  const moduleValue = GoogleProvider as unknown as { default?: unknown };
  return (
    typeof moduleValue.default === "function"
      ? moduleValue.default
      : GoogleProvider
  ) as typeof GoogleProvider;
})();

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: { id: string } & DefaultSession["user"];
  }
}

type MauticSyncInput = {
  email: string;
  name: string | null;
  brand_specific_credits: number;
  brand_specific_plan: string;
};

type MauticSync = (
  input: MauticSyncInput,
  brand: "gaminglogoai",
) => Promise<unknown>;

export function createGamingAuthOptions(options: {
  adapter: Adapter;
  clientId: string;
  clientSecret: string;
  secret: string | undefined;
  syncUserToMautic: MauticSync;
  getUserForMautic: (id: string) => Promise<GamingAuthProfile | null>;
}): NextAuthOptions {
  return {
    adapter: options.adapter,
    callbacks: {
      session({ session, user }) {
        if (session.user) session.user.id = user.id;
        return session;
      },
      redirect({ url, baseUrl }) {
        return url.startsWith(baseUrl) ? url : baseUrl;
      },
    },
    providers: [
      googleProviderFactory({
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
            scope: "openid email profile",
          },
        },
      }),
    ],
    secret: options.secret,
    debug: false,
    session: { strategy: "database" },
    useSecureCookies: true,
    cookies: {
      sessionToken: {
        name: "__Secure-next-auth.session-token",
        options: { httpOnly: true, sameSite: "lax", path: "/", secure: true },
      },
    },
    events: {
      async signIn({ user }) {
        if (!user.email) return;
        try {
          const latestUser = await options.getUserForMautic(user.id);
          if (!latestUser) return;
          await options.syncUserToMautic(
            {
              email: latestUser.email,
              name: latestUser.name,
              brand_specific_credits: latestUser.gamingCredits,
              brand_specific_plan: latestUser.gamingPlan,
            },
            "gaminglogoai",
          );
        } catch {
          console.error("Mautic sign-in synchronization failed");
        }
      },
      async createUser({ user }) {
        if (!user.email) return;
        try {
          await options.syncUserToMautic(
            {
              email: user.email,
              name: user.name ?? null,
              brand_specific_credits: 1,
              brand_specific_plan: "None",
            },
            "gaminglogoai",
          );
        } catch {
          console.error("Mautic user synchronization failed");
        }
      },
    },
  };
}
