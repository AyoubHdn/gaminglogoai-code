import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { StudioBannerWorkspace } from "~/component/studio/StudioBannerWorkspace";
import { StudioEmoteWorkspace } from "~/component/studio/StudioEmoteWorkspace";
import { StudioLogoWorkspace } from "~/component/studio/StudioLogoWorkspace";
import { StudioPfpWorkspace } from "~/component/studio/StudioPfpWorkspace";
import { StudioShell } from "~/component/studio/StudioShell";
import { StudioThumbnailWorkspace } from "~/component/studio/StudioThumbnailWorkspace";

const StudioPage: NextPage = () => {
  const router = useRouter();
  const requestedTool =
    typeof router.query.tool === "string" ? router.query.tool : "logo";
  const selectedTool =
    requestedTool === "pfp" ||
    requestedTool === "banner" ||
    requestedTool === "thumbnail" ||
    requestedTool === "emote"
      ? requestedTool
      : "logo";

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const tool =
      typeof router.query.tool === "string" ? router.query.tool : "logo";

    if (
      tool !== "logo" &&
      tool !== "pfp" &&
      tool !== "banner" &&
      tool !== "thumbnail" &&
      tool !== "emote"
    ) {
      void router.replace(
        {
          pathname: "/studio",
          query: {
            tool: "logo",
            ...(typeof router.query.game === "string"
              ? { game: router.query.game }
              : {}),
          },
        },
        undefined,
        { shallow: true },
      );
    }
  }, [router]);

  return (
    <>
      <StudioShell>
        {selectedTool === "emote" ? (
          <StudioEmoteWorkspace />
        ) : selectedTool === "thumbnail" ? (
          <StudioThumbnailWorkspace />
        ) : selectedTool === "banner" ? (
          <StudioBannerWorkspace />
        ) : selectedTool === "pfp" ? (
          <StudioPfpWorkspace />
        ) : (
          <StudioLogoWorkspace />
        )}
      </StudioShell>

      <Head>
        <title>GamingLogoAI Studio</title>
        <meta
          name="description"
          content="Create gaming logos, PFPs, Twitch banners, YouTube thumbnails, and emotes in the unified GamingLogoAI Studio."
        />
        <meta name="robots" content="noindex,follow" />
        <meta name="googlebot" content="noindex,follow" />
      </Head>
    </>
  );
};

export default StudioPage;
