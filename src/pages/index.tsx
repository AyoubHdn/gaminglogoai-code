// src/pages/index.tsx (This will be the homepage for GamingLogoAI)
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link"; // Use Link for navigation
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

const HomePage: NextPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const router = useRouter();

  const SITE_URL = process.env.HOST_NAME || "https://gaminglogoai.com";

  function HeroBanner() {
    // Option A: Single CTA leading to a choice page or primary tool
    // const handleGetStarted = () => { void router.push("/gaming-logo-maker"); };

    // Option B: Separate CTAs if you want to direct them immediately
    const handleGoToGamingLogo = () => { void router.push("/gaming-logo-maker"); };
    const handleGoToFaceLogo = () => { void router.push("/face-logo-generator"); }; // New page

    return (
      <section className="py-16 md:py-24 px-4 sm:px-8 text-center bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-950 text-white rounded-b-3xl shadow-2xl">
        <div className="container mx-auto">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Image
              src="/game-logo-example.webp" // Example of a text/icon gaming logo
              alt="AI Generated Gaming Logo Example"
              width={150} height={150}
              className="rounded-xl shadow-xl border-2 border-cyan-500"
              priority
            />
            <Image
              src="/face-logo-example.webp" // Example of an AI face logo
              alt="AI Generated Face Logo Example"
              width={150} height={150}
              className="rounded-xl shadow-xl border-2 border-purple-500"
              priority
            />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Create <span className="text-cyan-400">Pro Gaming Logos</span> & <span className="text-purple-400">AI Face Mascots</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Instantly design unique gaming logos OR transform your photo into an epic AI gaming mascot! Perfect for esports, streaming, or personal branding.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={handleGoToGamingLogo}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold rounded-lg text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
              id="cta-gaming-logo"
            >
              Design Gaming Logo
            </button>
            <button
              onClick={handleGoToFaceLogo}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
              id="cta-face-logo"
            >
              Create AI Face Mascot
            </button>
          </div>
          <p className="mt-6 text-xs text-slate-400">Free to explore, credits for full resolution downloads.</p>
        </div>
      </section>
    );
  }
  function LogoTypesSection() { // Renamed from CategorySection
    const logoTypes = [
      {
        name: "AI Gaming Logos",
        description: "Generate text, icon, or mascot logos for your team or channel.",
        icon: "/user-game-logo.webp", // REPLACE
        href: "/gaming-logo-maker",
        cta: "Design Gaming Logo",
        id: "link-gaming-logo"
      },
      {
        name: "AI Face Logos / Mascots",
        description: "Upload your photo and let AI create a stylized gaming mascot of you!",
        icon: "/face-logo-icon.webp", // REPLACE
        href: "/face-logo-generator",
        cta: "Create Your Face Mascot",
        id: "link-face-logo"
      },
    ];

    return (
      <section className="py-12 md:py-16 px-4 sm:px-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm mb-0 md:mb-0"> {/* Removed bottom margin if next section has top padding */}
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-slate-900 dark:text-white">
            What Kind of <span className="text-purple-600 dark:text-cyan-400">Awesome Logo</span> Will You Create?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {logoTypes.map((type) => (
              <div key={type.name} className="flex flex-col items-center bg-slate-50 dark:bg-slate-700 p-6 rounded-xl shadow-lg transition hover:shadow-xl hover:-translate-y-1">
                <Image
                  src={type.icon}
                  alt={`${type.name} Icon`}
                  width={80} height={80}
                  className="mb-5"
                />
                <h3 className="text-2xl font-bold mt-2 mb-3 text-slate-800 dark:text-white">{type.name}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-center mb-6 text-sm grow">
                  {type.description}
                </p>
                <Link href={type.href} id={type.id}
                  className="mt-auto px-6 py-2 bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 font-semibold rounded-lg hover:opacity-80 transition-opacity"
                >
                    {type.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  function KeyFeaturesSection() {
    const features = [
      { title: "Unique AI Concepts", description: "Fresh logo ideas every time, no templates.", icon: "/icons/feature-ai-brain.png" },
      { title: "Versatile Gamer Styles", description: "Mascots, emblems, text, face-styles & more.", icon: "/icons/feature-styles-controller.png" },
      { title: "Instant Creation", description: "Get your high-res logos in minutes, not days.", icon: "/icons/feature-download-rocket.png" },
      { title: "Easy to Use", description: "Simple prompts, powerful results. No design skills needed.", icon: "/icons/feature-customize-gear.png" },
      { title: "Affordable Options", description: "Premium designs with flexible credit packs.", icon: "/icons/feature-credits-coin.png" },
      { title: "For Every Gamer", description: "Individuals, teams, streamers, content creators.", icon: "/icons/feature-community-group.png" },
    ];

    return (
      <section className="py-16 md:py-20 px-4 sm:px-8 bg-white dark:bg-slate-800">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            Why <span className="text-purple-600 dark:text-cyan-400">GamingLogoAI</span> Stands Out
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-xl shadow-lg hover:shadow-purple-500/20 dark:hover:shadow-cyan-500/20 transition-shadow duration-300">
                <Image src={feature.icon} alt={`${feature.title} icon`} width={72} height={72} className="mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function HowItWorksSection() {
    const steps = [
        { number: "01", title: "Choose Your Logo Type", description: "Select AI Gaming Logo or AI Face Mascot." },
        { number: "02", title: "Provide Input", description: "Enter your name/text or upload your photo." },
        { number: "03", title: "Describe Your Style", description: "Tell our AI about colors, themes, and desired aesthetics." },
        { number: "04", title: "Generate & Refine", description: "Let AI create options. Pick your favorite and download!" },
    ];
    const handleGoToGamingLogo = () => { void router.push("/gaming-logo-maker"); };
    const handleGoToFaceLogo = () => { void router.push("/face-logo-generator"); };
    return (
      <section className="py-16 md:py-20 px-4 sm:px-8 bg-slate-100 dark:bg-slate-900">
        <div className="container mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
                Launch Your Logo in <span className="text-purple-600 dark:text-cyan-400">4 Easy Steps</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map(step => (
                    <div key={step.number} className="relative p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                        <div className="absolute -top-5 -left-3 w-12 h-12 bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                            {step.number}
                        </div>
                        <h3 className="mt-6 text-xl font-semibold mb-2 text-slate-800 dark:text-white">{step.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">{step.description}</p>
                    </div>
                ))}
            </div>
                <div className="text-center mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                    onClick={handleGoToGamingLogo}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-semibold rounded-lg text-md hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
                    id="how-it-works-cta-gaming"
                >
                    Start Designing Gaming Logo
                </button>
                <button
                    onClick={handleGoToFaceLogo}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg text-md hover:from-purple-600 hover:to-pink-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                    id="how-it-works-cta-face"
                >
                    Create Your Face Mascot
                </button>
            </div>
        </div>
      </section>
    );
  }


  function TestimonialSection() {
    // REPLACE with actual or plausible gaming-related testimonials
    const testimonials = [
      { quote: "Got an amazing mascot for my esports team in minutes! Seriously impressed.", name: "ShadowStrikerX", role: "Team Captain" },
      { quote: "My Twitch stream finally has a professional logo that matches my vibe. GamingLogoAI nailed it!", name: "PixelGirlPlays", role: "Twitch Streamer" },
      { quote: "Needed a quick, cool logo for my new mobile game and this was perfect. So easy!", name: "DevDude", role: "Indie Game Developer" },
    ];
    return (
      <section className="py-16 md:py-20 px-4 sm:px-8 bg-white dark:bg-slate-800">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            What <span className="text-purple-600 dark:text-cyan-400">Gamers Are Saying</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-slate-50 dark:bg-slate-700 rounded-xl shadow-lg flex flex-col">
                <svg className="w-10 h-10 text-purple-400 dark:text-cyan-400 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.333 7c-1.84 0-3.333 1.493-3.333 3.333v8c0 1.84 1.493 3.333 3.333 3.333h1.333v4l4-4h5.333c1.84 0 3.333-1.493 3.333-3.333v-8c0-1.84-1.493-3.333-3.333-3.333H9.333zm13.333 0c-1.84 0-3.333 1.493-3.333 3.333v8c0 1.84 1.493 3.333 3.333 3.333h1.333v4l4-4H28c1.84 0 3.333-1.493 3.333-3.333v-8c0-1.84-1.493-3.333-3.333-3.333H22.666z" />
                </svg>
                <blockquote className="text-slate-600 dark:text-slate-300 italic mb-4 grow">&quot;{testimonial.quote}&quot;</blockquote>
                <footer className="font-semibold text-slate-700 dark:text-slate-200">{testimonial.name} <span className="text-sm text-slate-500 dark:text-slate-400 block">{testimonial.role}</span></footer>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function FinalCTASection() { // Generalize or provide two CTAs
    const handleGoToGamingLogo = () => { void router.push("/gaming-logo-maker"); };
    const handleGoToFaceLogo = () => { void router.push("/face-logo-generator"); };
    return (
        <section className="py-16 md:py-24 px-4 sm:px-8 bg-gradient-to-r from-purple-700 via-indigo-800 to-purple-900 text-white">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Unleash Your Ultimate Gamer Identity?</h2>
                <p className="text-lg text-slate-200 mb-10 max-w-2xl mx-auto">
                    Whether it&apos;s a unique text-based logo or an epic AI mascot from your photo, create a professional design that stands out. Fast, fun, and free to start!
                </p>
                 <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button onClick={handleGoToGamingLogo} className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 ...">
                        Design Gaming Logo!
                    </button>
                    <button onClick={handleGoToFaceLogo} className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 ...">
                        Create AI Face Mascot!
                    </button>
                </div>
            </div>
        </section>
    );
  }


  return (
    <>
      <Head>
        <title>AI Logo Maker for Gamers: Gaming Logos & Face Mascots | GamingLogoAI</title>
        <meta
          name="description"
          content="Create unique gaming logos and AI face mascots in seconds with GamingLogoAI! Perfect for esports teams, Twitch streamers, YouTube, and personal gamer profiles. Try our AI logo generator free!"
        />
        <meta name="keywords" content="ai gaming logo, ai face logo, gaming mascot maker, esports logo generator, streamer logo, youtube gaming logo, custom game logo, ai avatar generator, personalized gaming logo" />
        <link rel="canonical" href="https://gaminglogoai.com/" /> {/* Replace with actual domain */}
        <meta property="og:description" content="Instantly design professional gaming logos or transform your photo into an epic AI gaming mascot. Fast, easy, and free to try!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/og-gaminglogoai.png`} /> {/* Create a specific OG image for homepage */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Logo Maker for Gamers: Gaming Logos & Face Mascots | GamingLogoAI" />
        <meta name="twitter:description" content="AI-powered logo creation for all gamers. Design text logos or unique face mascots." />
        <meta name="twitter:image" content={`${SITE_URL}/twitter-gaminglogoai.png`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Main page background color set by sections */}
      <main className="container mx-auto overflow-x-hidden"> {/* Added overflow-x-hidden to container */}
        <HeroBanner />
        <LogoTypesSection />
        <KeyFeaturesSection />
        <HowItWorksSection />
        <TestimonialSection />
        <FinalCTASection />
      </main>
    </>
  );
};

export default HomePage;