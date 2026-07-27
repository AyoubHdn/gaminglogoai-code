import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { StudioLogoWorkspace } from "~/component/studio/StudioLogoWorkspace";
import { StudioPfpWorkspace } from "~/component/studio/StudioPfpWorkspace";
import { StudioShell } from "~/component/studio/StudioShell";

const StudioPage: NextPage = () => {
  const router = useRouter();
  const selectedTool =
    typeof router.query.tool === "string" && router.query.tool === "pfp"
      ? "pfp"
      : "logo";

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const tool =
      typeof router.query.tool === "string" ? router.query.tool : "logo";

    if (tool !== "logo" && tool !== "pfp") {
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
        {selectedTool === "pfp" ? (
          <StudioPfpWorkspace />
        ) : (
          <StudioLogoWorkspace />
        )}
      </StudioShell>

      <Head>
        <title>GamingLogoAI Studio</title>
        <meta
          name="description"
          content="Create gaming logos in the unified GamingLogoAI Studio."
        />
        <meta name="robots" content="noindex,follow" />
        <meta name="googlebot" content="noindex,follow" />
      </Head>
    </>
  );
};

export default StudioPage;
