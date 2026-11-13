import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { syncUserToMautic } from "~/server/api/routers/mautic-utils";
import { createGamingAuthOptions } from "~/server/authOptionsFactory";
import { createPrismaGamingAuthDbService } from "~/server/authDbService";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = createGamingAuthOptions({
  adapter: PrismaAdapter(prisma),
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  secret: env.NEXTAUTH_SECRET,
  syncUserToMautic: async (input, brand) =>
    syncUserToMautic(
      {
        ...input,
        brand_specific_plan: input.brand_specific_plan,
      },
      brand,
    ),
  getUserForMautic: createPrismaGamingAuthDbService(prisma).getUserForMautic,
});

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
