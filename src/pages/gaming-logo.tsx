/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/pages/gaming-logo.tsx (Landing Page for the Text-to-Image Gaming Logo Maker)
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaChevronRight, FaPaintBrush, FaBolt, FaUsers, FaShieldAlt, FaMagic, FaGamepad, FaCogs, FaStar } from "react-icons/fa"; // Example Icons

const GamingLogoLandingPage: NextPage = () => {
  const router = useRouter();

  const handleStartDesigning = () => {
    // Navigate to the actual tool page
    void router.push("/gaming-logo-maker"); // <<<< UPDATE THIS if your tool page URL is different
  };

  const features = [
    { title: "AI-Powered Engine", description: "Harness advanced AI to generate countless unique logo concepts in seconds.", icon: <FaMagic className="h-10 w-10" /> },
    { title: "Vast Style Library", description: "Explore styles from top games, art genres, themes, mascots, and more.", icon: <FaPaintBrush className="h-10 w-10" /> },
    { title: "Instant Generation", description: "No waiting. See your logo ideas immediately and iterate on the fly.", icon: <FaBolt className="h-10 w-10" /> },
    { title: "For Every Gamer", description: "Perfect for esports teams, Twitch streamers, YouTube channels, or personal branding.", icon: <FaUsers className="h-10 w-10" /> },
    { title: "Easy Customization", description: "Input your text, pick styles, and let the AI craft your vision.", icon: <FaCogs className="h-10 w-10" /> },
    { title: "Pro-Quality Downloads", description: "Get high-resolution, transparent PNGs ready for any platform.", icon: <FaShieldAlt className="h-10 w-10" /> },
  ];

  const exampleShowcase = [
    { src: "/styles/s22e.webp", alt: "Example of an AI generated mascot gaming logo", caption: "Fierce Mascot Logos" }, // ** REPLACE with actual example images **
    { src: "/styles/s429e.webp", alt: "Example of an AI generated text-based esports logo", caption: "Sleek Esports Emblems" },
    { src: "/styles/s407e.webp", alt: "Example of an AI generated retro pixel art gaming logo", caption: "Retro & Pixel Styles" },
    { src: "/styles/s380e.webp", alt: "Example of an AI generated Moba gaming logo", caption: "Modern Moba Designs" },
  ];

  const testimonials = [
      { quote: "Got an amazing mascot for my esports team in minutes! GamingLogoAI is a game-changer.", name: "ShadowStrikerX", role: "Esports Team Captain" },
      { quote: "My Twitch stream finally has a professional logo that actually looks cool. So easy!", name: "PixelGirlPlays", role: "Twitch Streamer" },
      { quote: "Needed unique logos for my clan members, and this AI delivered beyond expectations.", name: "Warlord77", role: "Clan Leader" },
  ];


  return (
    <>
      <Head>
        <title>AI Gaming Logo Maker - Create Custom Esports & Streamer Logos | GamingLogoAI</title>
        <meta
          name="description"
          content="Design your unique gaming logo in seconds with GamingLogoAI! Our AI-powered generator creates stunning, professional logos for esports teams, streamers, and gamers. Try it now!"
        />
        <meta name="keywords" content="gaming logo maker, ai gaming logo, esports logo, streamer logo, custom game logo, create gaming logo, logo generator gaming, team logo maker" />
        <link rel="canonical" href="https://gaminglogoai.com/gaming-logo" /> {/* ** REPLACE with your actual domain ** */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 text-center text-white overflow-hidden">
          {/* Background Image/Video - Replace with a dynamic gaming background */}
          <Image
            src="/gaminglogo-ai-banner.png" // ** REPLACE with a cool, abstract gaming background **
            alt="Abstract gaming background"
            layout="fill"
            objectFit="cover"
            quality={75}
            className="z-0 opacity-30 dark:opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-indigo-950/80 to-slate-900/90 z-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <Image
              src="/styles/s385e.webp" // ** REPLACE with your main GamingLogoAI icon/mascot if you have one **
              alt="Gaming Logo AI Icon"
              width={140}
              height={140}
              className="mx-auto mb-6 transform transition-transform duration-500 hover:scale-110"
              priority
            />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              AI-Powered <span className="text-cyan-400">Gaming Logo</span> Maker
            </h1>
            <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto mb-10 drop-shadow-sm">
              Unleash your gaming identity! Generate unique, professional logos for your esports team, Twitch stream, YouTube channel, or personal brand in minutes.
            </p>
            <button
              onClick={handleStartDesigning}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold rounded-lg text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-cyan-500/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50"
              id="cta-hero-to-generator-tool"
            >
              Create Your Free Logo Preview <FaChevronRight className="inline ml-2 -mr-1" />
            </button>
            <p className="mt-4 text-xs text-slate-400">Generate unlimited previews. Credits needed for high-res downloads.</p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                    Level Up Your Brand with <span className="text-purple-600 dark:text-cyan-400">AI Precision</span>
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Our intelligent logo generator offers everything you need to stand out.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex p-6 bg-slate-50 dark:bg-slate-800/60 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700/50">
                  <div className="flex-shrink-0 mr-5 text-purple-600 dark:text-cyan-400">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
                    Your Epic Logo in <span className="text-purple-600 dark:text-cyan-400">3 Simple Steps</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        { num: "01", title: "Enter Your Text", desc: "Type your gamer tag, team name, or any text for your logo.", icon: <FaGamepad className="h-10 w-10 mx-auto mb-3"/> },
                        { num: "02", title: "Choose Your Style", desc: "Browse our vast library of gaming-specific styles and themes.", icon: <FaPaintBrush className="h-10 w-10 mx-auto mb-3"/> },
                        { num: "03", title: "Generate & Download", desc: "Our AI creates unique options. Pick your favorite and download!", icon: <FaShieldAlt className="h-10 w-10 mx-auto mb-3"/> }
                    ].map(step => (
                        <div key={step.num} className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                            <div className="text-purple-600 dark:text-cyan-400">{step.icon}</div>
                            <h3 className="text-xl font-semibold my-2 text-slate-800 dark:text-white">{step.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <button onClick={handleStartDesigning} className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-md transition-colors duration-300 shadow-md hover:shadow-lg dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-900">
                        Start Designing for Free
                    </button>
                </div>
            </div>
        </section>

        {/* Example Showcase Section */}
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              Limitless <span className="text-purple-600 dark:text-cyan-400">Design Possibilities</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {exampleShowcase.map((example) => (
                <div key={example.caption} className="group relative rounded-lg shadow-lg overflow-hidden aspect-square">
                  <Image src={example.src} alt={example.alt} layout="fill" objectFit="cover" className="transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-white drop-shadow-md">{example.caption}</h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
                <Link href="/gaming-logo-maker" legacyBehavior={false} className="px-8 py-3 font-semibold rounded-lg transition-all duration-300 ease-in-out
                                  border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white
                                  dark:border-cyan-500 dark:text-cyan-400 dark:hover:bg-cyan-500 dark:hover:text-slate-900"> {/* Link to your "Browse All Styles" hub page */}
                        Explore All Styles
                </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
                    Loved by <span className="text-purple-600 dark:text-cyan-400">Gamers & Streamers</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700/50 flex flex-col">
                        <div className="flex mb-4">
                            {[...Array(5)].map((_, i) => <FaStar key={i} className="text-yellow-400 h-5 w-5" />)}
                        </div>
                        <blockquote className="text-slate-600 dark:text-slate-300 italic mb-4 grow text-sm">&quot;{testimonial.quote}&quot;</blockquote>
                        <footer className="font-semibold text-slate-700 dark:text-slate-200">{testimonial.name} 
                            <span className="block text-xs text-purple-500 dark:text-cyan-400 font-normal">{testimonial.role}</span>
                        </footer>
                    </div>
                ))}
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 text-center bg-gradient-to-tr from-indigo-900 via-purple-950 to-slate-900 text-white">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Define Your Gaming Legacy?</h2>
            <p className="text-lg text-slate-200 mb-10 max-w-xl mx-auto">
              Your ultimate gaming logo is just moments away. Start for free, experiment with styles, and find the perfect design to conquer the digital arena!
            </p>
            <button
              onClick={handleStartDesigning}
              className="px-10 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-bold rounded-lg text-xl hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-cyan-400/60 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50"
              id="cta-final-to-generator-tool-bottom"
            >
              Design My Gaming Logo Now!
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default GamingLogoLandingPage;