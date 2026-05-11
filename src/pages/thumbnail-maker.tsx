import clsx from "clsx";
import { type NextPage } from "next";
import Head from "next/head";

import { FunnelProvider, useFunnel } from "~/component/thumbnailFunnel/FunnelContext";
import { Step0PlatformSelector } from "~/component/thumbnailFunnel/Step0PlatformSelector";
import { Step1TemplateBrowser } from "~/component/thumbnailFunnel/Step1TemplateBrowser";
import { Step2Personalize } from "~/component/thumbnailFunnel/Step2Personalize";
import { Step3Result } from "~/component/thumbnailFunnel/Step3Result";

const PAGE_TITLE = "Thumbnail Maker - YouTube Gaming Thumbnails | GamingLogoAI";
const PAGE_DESCRIPTION =
  "Create AI-generated gaming thumbnails with a guided flow. Choose a platform, pick a template, personalize, and generate.";
const PAGE_URL = "https://gaminglogoai.com/thumbnail-maker";

function ThumbnailMakerContent() {
  const { currentStep, hasHydrated } = useFunnel();

  const stepOrder = ["step0", "step1", "step2", "step3"] as const;
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const steps = [
    {
      step: 1,
      key: "step0",
      title: "Platform",
      description: "Choose your destination",
    },
    {
      step: 2,
      key: "step1",
      title: "Template",
      description: "Browse thumbnail presets",
    },
    {
      step: 3,
      key: "step2",
      title: "Personalize",
      description: "Add image and title",
    },
    {
      step: 4,
      key: "step3",
      title: "Result",
      description: "Generate, refine, and download",
    },
  ] as const;

  return (
    <main className="container mx-auto max-w-screen-xl px-4 py-8 sm:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
          Thumbnail Maker
        </h1>
        <p className="mx-auto mt-3 max-w-3xl text-lg text-slate-600 dark:text-slate-400">
          Pick a platform, choose a template, personalize your title and reference
          image, and generate a platform-ready thumbnail in one guided flow.
        </p>
      </header>

      <section className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-4">
        {steps.map((item, index) => {
          const isCurrent = currentStep === item.key;
          const isComplete = currentStepIndex > index;

          return (
            <div
              key={item.step}
              className={clsx(
                "rounded-2xl border p-4 transition-colors",
                isCurrent
                  ? "border-purple-500 bg-purple-50/70 dark:border-cyan-400 dark:bg-cyan-500/10"
                  : isComplete
                    ? "border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={clsx(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold",
                    isCurrent || isComplete
                      ? "bg-purple-600 text-white dark:bg-cyan-400 dark:text-slate-950"
                      : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  )}
                >
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {!hasHydrated ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-purple-600 dark:border-slate-700 dark:border-t-cyan-400" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Restoring your thumbnail funnel session...
          </p>
        </section>
      ) : currentStep === "step0" ? (
        <Step0PlatformSelector />
      ) : currentStep === "step1" ? (
        <Step1TemplateBrowser />
      ) : currentStep === "step2" ? (
        <Step2Personalize />
      ) : (
        <Step3Result />
      )}
    </main>
  );
}

const ThumbnailMakerPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta
          property="og:image"
          content="https://gaminglogoai.com/og-image-gaminglogoai.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="GamingLogoAI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta
          name="twitter:image"
          content="https://gaminglogoai.com/og-image-gaminglogoai.png"
        />
      </Head>

      <FunnelProvider>
        <ThumbnailMakerContent />
      </FunnelProvider>
    </>
  );
};

export default ThumbnailMakerPage;
