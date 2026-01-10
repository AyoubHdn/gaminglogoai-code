/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/index.tsx (This will be the homepage for GamingLogoAI)
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link"; // Use Link for navigation
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FaChevronRight } from "react-icons/fa"; // Example Icons
import { s3Style } from "~/utils/s3Paths";

const HomePage: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const gamingLogoLandingUrl = "/gaming-logo";
  const pfpLandingUrl = "/ai-profile-picture-maker";

  const handleGoToGamingLogo = () => { void router.push(gamingLogoLandingUrl); };
  const handleGoToPfpMaker = () => { void router.push(pfpLandingUrl); };

  function HeroBanner() {
    return (
      <section className="relative py-20 md:py-32 text-center text-white overflow-hidden">
        {/* You need a very cool, abstract gaming background here */}
        <Image src="/images/home-hero-bg.webp" alt="Abstract gaming background with neon lights" layout="fill" objectFit="cover" quality={80} className="z-0 opacity-20" priority />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 z-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-20">
          {/* Main Headline (H1) - TARGETING YOUR TOP KEYWORDS */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_50%)]">
            The Ultimate <span className="text-cyan-400">AI Gaming Logo Generator</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto mb-10 drop-shadow-sm">
            Instantly create professional <strong>gaming logos</strong>, <strong>Twitch banners</strong>, and <strong>Twitch panels</strong> using AI.
            Perfect for esports teams, streamers, and content creators who want a complete gaming brand.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={handleGoToGamingLogo}
               className="text-lg font-bold shadow-xl"
              id="cta-hero-gaming-logo"
            >
              Design Text & Mascot Logos <FaChevronRight className="inline ml-2" />
            </button>
            <button
              onClick={handleGoToPfpMaker}
               className="text-lg font-bold shadow-xl"
              id="cta-hero-pfp-maker"
            >
              Create AI PFP from Photo <FaChevronRight className="inline ml-2" />
            </button>
          </div>
          <p className="mt-6 text-xs text-slate-400">Get 1 free credit on signup to start designing.</p>
        </div>
      </section>
    );
  }

  function LogoTypesSection() { // Renamed from CategorySection
    const logoTypes = [
      {
        name: "AI Gaming Logos",
        description: "Generate stunning text, icon, or gaming mascot logos for your clan, team, or channel.",
        icon: "/user-game-logo.webp",
        href: "/gaming-logo-maker",
        cta: "Explore Text Logos",
        id: "link-gaming-logo"
      },
      {
        name: "AI Photo Avatars (PFP)",
        description: "Upload your photo and let our AI create a stylized gaming mascot or PFP of you!",
        icon: "/face-logo-icon.webp",
        href: "/face-logo-generator",
        cta: "Explore Photo Avatars",
        id: "link-face-logo"
      },
    ];

    return (
      <section className="py-16 md:py-20 px-4 sm:px-8 bg-white dark:bg-slate-900">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            What Kind of <span className="text-purple-600 dark:text-cyan-400">Legendary Logo</span> Will You Create?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {logoTypes.map((type) => (
              <div key={type.name} className="flex flex-col items-center bg-slate-50 dark:bg-slate-800 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-purple-300 dark:hover:border-cyan-400">
                <Image src={type.icon} alt={`${type.name} Icon`} width={100} height={100} className="mb-5 rounded-lg" />
                <h3 className="text-2xl font-bold mt-2 mb-3 text-slate-800 dark:text-white">{type.name}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-center mb-6 text-sm grow">{type.description}</p>
                <Link href={type.href} id={type.id}
                  className="mt-auto px-6 py-2 bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 font-semibold rounded-lg hover:opacity-90 transition-opacity">
                    {type.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function TwitchBannerSection() {
    return (
      <section className="py-16 md:py-20 px-4 sm:px-8 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            Design Stunning <span className="text-purple-600 dark:text-cyan-400">Twitch Banners</span> in Seconds
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            
            {/* Image Preview */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl group aspect-video">
              <Image
                src="/twitch/banner/blue_tech_glitch_prv.png" // << replace with your S3 preview later
                alt="AI Twitch Banner Example"
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-500 group-hover:scale-105"
                unoptimized={true}
              />
            </div>

            {/* Text + Features */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Professional Twitch Channel Branding — Made by AI
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Elevate your Twitch stream with eye-catching AI-generated banner art.
                Customize colors, styles, characters, and layouts — perfect for streamers
                who want a professional look **without hiring a designer**.
              </p>

              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 mb-8">
                <li>🎨 <strong>Wide style library</strong>: neon, cyberpunk, cute, minimal, esports, and more</li>
                <li>⚡ <strong>Instant high-quality render</strong> powered by advanced AI</li>
                <li>🖼️ Perfect Twitch dimensions (user doesn’t need to crop)</li>
                <li>🎁 Includes <strong>1 free banner credit on signup</strong></li>
              </ul>

              <Link
                href="/twitch-banner-generator"
                className="inline-block px-8 py-3 bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
                id="cta-home-twitch-banner"
              >
                Create Your Twitch Banner →
              </Link>
            </div>

          </div>
        </div>
      </section>
    );
  }
  function TwitchPanelsSection() {
    return (
      <section className="py-16 md:py-20 px-4 sm:px-8 bg-white dark:bg-slate-900">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            Create Clean <span className="text-purple-600 dark:text-cyan-400">Twitch Panels</span> Instantly
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            
            {/* Text */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                About · Donate · Rules · Socials — Done Right
              </h3>

              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Design professional Twitch panels in the correct <strong>320×100 format</strong>.
                No design tools, no Photoshop — just type your text and let AI do the rest.
              </p>

              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 mb-8">
                <li>📐 Perfect Twitch panel dimensions (320×100)</li>
                <li>🎨 Minimal, neon, dark & gradient styles</li>
                <li>⚡ Instant generation with AI</li>
                <li>✨ Optional AI enhancement for premium look</li>
              </ul>

              <Link
                href="/twitch-panels-generator"
                className="inline-block px-8 py-3 bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
                id="cta-home-twitch-panels"
              >
                Create Twitch Panels →
              </Link>
            </div>

            {/* Image Preview */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[16/5]">
              <Image
                src="/twitch/panels/blue_tech_glitch_prv.webp" 
                alt="AI Twitch Panels Examples"
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  function TwitchEmotesSection() {
    return (
      <section className="py-16 md:py-20 px-4 sm:px-8 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            Create Expressive <span className="text-purple-600 dark:text-cyan-400">Twitch Emotes</span> from Your Face
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            
            {/* Image Preview */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/twitch/emotes/emotes-boy.png"
                alt="Custom Twitch emotes generated from a real face using AI"
                width={600}
                height={400}
                className="rounded-xl"
                unoptimized
              />
            </div>

            {/* Text */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                From Photo to GG, LOL, HYPE & More
              </h3>

              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Upload a real photo and let AI transform it into a full set of expressive
                Twitch emotes. Perfect for chat reactions, subscriber perks, and personal branding.
              </p>

              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 mb-8">
                <li>😄 Generate multiple emote expressions from one character</li>
                <li>🧠 AI-designed cartoon & anime styles made for chat</li>
                <li>📐 Optimized for Twitch emote sizes (28 / 56 / 112)</li>
                <li>🧼 Transparent background — ready to upload</li>
              </ul>

              <Link
                href="/twitch-emote-maker"
                className="inline-block px-8 py-3 bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
                id="cta-home-twitch-emotes"
              >
                Create Twitch Emotes →
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function KeyFeaturesSection() {
    const features = [
      { title: "Unique AI Concepts", description: "Fresh logo ideas every time, no templates.", icon: "/icons/feature-ai-brain.webp" },
      { title: "Versatile Gamer Styles", description: "Mascots, emblems, text, face-styles & more.", icon: "/icons/feature-styles-controller.webp" },
      { title: "Instant Creation", description: "Get your high-res logos in minutes, not days.", icon: "/icons/feature-download-rocket.webp" },
      { title: "Easy to Use", description: "Simple prompts, powerful results. No design skills needed.", icon: "/icons/feature-customize-gear.webp" },
      { title: "Affordable Options", description: "Premium designs with flexible credit packs.", icon: "/icons/feature-credits-coin.webp" },
      { title: "For Every Gamer", description: "Individuals, teams, streamers, content creators.", icon: "/icons/feature-community-group.webp" },
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
                <Image src={feature.icon} alt={`${feature.title} icon`} width={72} height={72} className="mb-4" unoptimized={true}/>
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
  // Add this function component inside your HomePage component in src/pages/index.tsx
function WhoIsThisForSection() {
  const targetAudiences = [
    {
      name: "Esports Teams & Clans",
      description: "Generate a professional team logo that builds unity and intimidates the competition. Perfect for jerseys, banners, and social media branding.",
      icon: s3Style("/styles/s432e.webp"), // ** CREATE a 64x64 icon for this **
      alt: "Icon for an esports team shield",
    },
    {
      name: "Twitch & YouTube Streamers",
      description: "Create a unique streamer logo or a custom PFP that grabs attention. Build a recognizable brand for your channel from day one.",
      icon: s3Style("/styles/f7.webp"), // ** CREATE a 64x64 icon for this **
      alt: "Icon representing a streaming camera or play button",
    },
    {
      name: "Content Creators & Gamers",
      description: "Whether you need a cool gaming avatar, a YouTube channel logo, or a custom PFP, our AI logo maker provides endless creative options.",
      icon: s3Style("/styles/f28.webp"), // ** CREATE a 64x64 icon for this **
      alt: "Icon of a gamer with a headset",
    },
  ];

  return (
    <section className="py-16 md:py-20 px-4 sm:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
          Designed for <span className="text-purple-600 dark:text-cyan-400">Every Kind of Gamer</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {targetAudiences.map((audience) => (
            <div key={audience.name} className="p-6 text-center bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <Image
                src={audience.icon}
                alt={audience.alt}
                width={64}
                height={64}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">{audience.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Add this function component inside your HomePage component in src/pages/index.tsx
function StyleShowcaseSection() {
  const showcaseItems = [
    {
      title: "Create an Epic Gaming Mascot",
      description: "Bring your team to life with a fierce dragon, a stealthy ninja, or any other powerful mascot. Our AI can generate thousands of unique characters to represent your clan.",
      imageUrl: s3Style("/styles/s486e.webp"), // ** REPLACE with a great mascot logo **
      alt: "An AI-generated fierce dragon gaming mascot logo",
      ctaText: "Design a Mascot Logo",
      ctaLink: "/gaming-logo-maker", // Example of pre-filtering
    },
    {
      title: "Design a Professional Esports PFP",
      description: "Craft a clean, modern esports PFP perfect for competitive teams. Our AI logo generator creates badge and shield designs that look great on jerseys and banners.",
      imageUrl: "/images/showcase/fortnite-pfp-4.webp", // ** REPLACE with a great emblem logo **
      alt: "A professional esports PFP for a gaming team created by AI",
      ctaText: "Create a PFP",
      ctaLink: "/pfp-maker",
    },
  ];

  return (
    <section className="py-16 md:py-20 px-4 sm:px-8 bg-white dark:bg-slate-900">
      <div className="container mx-auto">
        {showcaseItems.map((item, index) => (
          <div
            key={item.title}
            className={`flex flex-col md:flex-row items-center gap-8 lg:gap-16 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''} ${index > 0 ? 'mt-16' : ''}`}
          >
            {/* Image Column */}
            <div className="w-full md:w-1/2">
              <div className="relative aspect-square rounded-xl shadow-2xl overflow-hidden group">
                <Image
                  src={item.imageUrl}
                  alt={item.alt}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
            {/* Text Column */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                {item.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                {item.description}
              </p>
              <Link href={item.ctaLink}
                className="inline-block px-8 py-3 bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md">
                  {item.ctaText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


  return (
    <>
      <Head>
        <title>AI Gaming Logo Generator & Mascot Maker | GamingLogoAI</title>
        <meta
          name="description"
          content="Create a stunning AI gaming logo or mascot with GamingLogoAI! Our generator is perfect for esports teams, streamers, and clans. Sign up to get 1 free credit to start designing now!"
        />
        <meta name="keywords" content="ai gaming logo generator, gaming logo maker ai, ai gaming logo, gaming mascot, gaming logo ai free, esports logo, custom gaming logo" />
        <link rel="canonical" href="https://gaminglogoai.com/" />
        <meta property="og:title" content="AI Gaming Logo Generator & Mascot Maker | GamingLogoAI" />
        <meta property="og:description" content="Create a stunning AI gaming logo or mascot with GamingLogoAI! Our generator is perfect for esports teams, streamers, and clans. Sign up to get 1 free credit to start designing now!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gaminglogoai.com/" />
        <meta property="og:image" content="https://gaminglogoai.com/og-image-gaminglogoai.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Gaming Logo Generator & Mascot Maker | GamingLogoAI" />
        <meta name="twitter:description" content="Create stunning AI-powered logos and mascots for your gaming brand. Fast, easy, and free to try." />
        <meta name="twitter:image" content="https://gaminglogoai.com/twitter-image-gaminglogoai.png" /> 
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.webp" />
      </Head>
      <main className="container mx-auto overflow-x-hidden">
        <HeroBanner />
        <LogoTypesSection />
        <TwitchBannerSection />
        <TwitchPanelsSection />
        <TwitchEmotesSection />
        <WhoIsThisForSection />
        <StyleShowcaseSection />
        <KeyFeaturesSection />
        <HowItWorksSection />
        <TestimonialSection />
        <FinalCTASection />
      </main>
    </>
  );
};

export default HomePage;