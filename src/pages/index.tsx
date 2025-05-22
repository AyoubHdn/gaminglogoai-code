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

  function HeroBanner() {
    const handleGetStarted = () => {
      void router.push("/gaming-logo-maker");
    };

    return (
      <section className="py-16 md:py-24 px-4 sm:px-8 text-center bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-950 text-white rounded-b-3xl shadow-2xl">
        <div className="container mx-auto">
          <Image 
            src="/game-logo.webp" // REPLACE with a dynamic hero image related to your logo
            alt="Epic AI Generated Gaming Mascot"
            width={200}
            height={200}
            className="mx-auto mb-6 rounded-full shadow-xl border-4 border-cyan-500"
            priority // Prioritize hero image loading
          />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Forge Your <span className="text-cyan-400">Legendary</span> Gaming Logo with AI
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Instantly create unique, professional logos for your esports team, Twitch stream, YouTube channel, or gamer profile. No design skills needed—just pure AI power!
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold rounded-lg text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
            id="get-started-gaming-logo-hero"
          >
            Create Your Gaming Logo Now
          </button>
            <p className="mt-4 text-xs text-slate-400">Free to try, credits needed for full resolution downloads.</p>
        </div>
      </section>
    );
  }

  function KeyFeaturesSection() {
    const features = [
      { title: "AI-Powered Designs", description: "Get unique logo concepts in seconds.", icon: "/icons/feature-ai-brain.png" },
      { title: "Pro Gamer Styles", description: "Mascots, emblems, futuristic, retro & more.", icon: "/icons/feature-styles-controller.png" },
      { title: "Instant Download", description: "High-res logos ready for your stream or team.", icon: "/icons/feature-download-rocket.png" },
      { title: "Easy Customization", description: "Fine-tune prompts for the perfect look.", icon: "/icons/feature-customize-gear.png" },
      { title: "Affordable Credits", description: "Premium designs without breaking the bank.", icon: "/icons/feature-credits-coin.png" },
      { title: "For All Gamers", description: "Teams, streamers, YouTubers, casual players.", icon: "/icons/feature-community-group.png" },
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
        { number: "01", title: "Enter Your Name", description: "Type your gamer tag, team name, or channel title." },
        { number: "02", title: "Pick a Style", description: "Browse diverse gaming themes like mascots, futuristic, abstract, etc." },
        { number: "03", title: "Select Options", description: "Choose AI model, aspect ratio, and number of variations." },
        { number: "04", title: "Generate & Download", description: "Let the AI create! Download your favorite high-res logo." },
    ];
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
             <div className="text-center mt-12">
                <Link href="/gaming-logo-maker" className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-semibold rounded-lg text-md hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
                      id="how-it-works-cta">
                        Start Designing Your Logo
                </Link>
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

  function FinalCTASection() {
     const handleStartDesigning = () => {
      void router.push("/gaming-logo-maker");
    };
    return (
        <section className="py-16 md:py-24 px-4 sm:px-8 bg-gradient-to-r from-purple-700 via-indigo-800 to-purple-900 text-white">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Dominate with a Killer Logo?</h2>
                <p className="text-lg text-slate-200 mb-10 max-w-2xl mx-auto">
                    Stop using generic templates. Create a unique, AI-powered gaming logo that truly represents you or your team. It’s fast, fun, and free to start!
                </p>
                <button
                    onClick={handleStartDesigning}
                    className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold rounded-lg text-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-cyan-500/60"
                    id="final-cta-gaming-logo"
                >
                    Design My Gaming Logo Now!
                </button>
            </div>
        </section>
    );
  }


  return (
    <>
      <Head>
        <title>Gaming Logo AI - Free AI Gaming Logo Generator for Esports & Streamers</title>
        <meta
          name="description"
          content="Create stunning, unique gaming logos in seconds with GamingLogoAI! Our AI-powered generator is perfect for esports teams, Twitch streamers, YouTube channels, and individual gamers. Try free now!"
        />
        <meta name="keywords" content="gaming logo generator, ai logo maker, esports logo, streamer logo, youtube gaming logo, free gaming logo, custom game logo, team logo maker, gaming branding" />
        <link rel="canonical" href="https://www.gaminglogoai.com/" /> {/* Replace with actual domain */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Main page background color set by sections */}
      <main className="container mx-auto overflow-x-hidden"> {/* Added overflow-x-hidden to container */}
        <HeroBanner />
        <KeyFeaturesSection />
        <HowItWorksSection />
        {/* <StatisticsSection />  Optional: Add back if you have GLA specific stats */}
        {/* <DemoSection /> Optional: Create a new demo video for GLA */}
        <TestimonialSection />
        {/* <UserFeedbackSection /> Optional: Get GLA specific feedback images */}
        {/* <BenefitsSection /> Optional: Re-theme and re-word for GLA */}
        <FinalCTASection />
      </main>
    </>
  );
};

export default HomePage;