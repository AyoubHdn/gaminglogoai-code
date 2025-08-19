// src/pages/minecraft-logos.tsx
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "~/component/Button";
import { FaChevronRight, FaCubes, FaPaintBrush, FaDownload } from "react-icons/fa"; // Example Icons

// This array showcases your best Minecraft-style logo examples.
// These should be pre-generated using your tool and the styles you listed.
const minecraftStyleExamples = [
  // ** REPLACE these with ACTUAL paths to your best Minecraft-style example images **
  { src: "/Styles/s701e.webp", alt: "AI generated Minecraft block emblem logo" },
  { src: "/Styles/s702e.webp", alt: "Minecraft server logo with a diamond pickaxe created by AI" },
  { src: "/Styles/s703e.webp", alt: "Custom Minecraft creeper mascot logo for a YouTube channel" },
  { src: "/Styles/s704e.webp", alt: "Minecraft logo for a clan featuring a pixelated sword" },
  { src: "/Styles/s705e.webp", alt: "AI Minecraft logo maker example with a hero character" },
  { src: "/Styles/s706e.webp", alt: "Cool Enderman-inspired logo for Minecraft" },
  { src: "/Styles/s707e.webp", alt: "Minecraft logo for YouTube with a blocky animal mascot" },
  { src: "/Styles/s708e.webp", alt: "Pixel badge logo for a Minecraft server" },
];

const MinecraftLogoLandingPage: NextPage = () => {
  const router = useRouter();

  const handleStartDesigning = () => {
    // Navigate to the tool, ideally pre-filtered for Minecraft styles
    // Example: /gaming-logo-tool?category=By+Game+Title&subcategory=Minecraft
    void router.push("/gaming-logo-maker");
  };

  return (
    <>
      <Head>
        <title>Minecraft Logo Maker - AI Generator for Servers & YouTube | GamingLogoAI</title>
        <meta
          name="description"
          content="Create custom logos for your Minecraft server, YouTube channel, or profile with our AI Minecraft logo generator. Design unique blocky, pixel art, and creeper-style logos in seconds!"
        />
        <meta name="keywords" content="minecraft logo maker, logo for minecraft, minecraft server logo, minecraft logo generator, ai minecraft logo, creeper logo, minecraft youtube logo, custom minecraft logo" />
        <link rel="canonical" href="https://gaminglogoai.com/minecraft-logos" /> {/* ** REPLACE with actual domain ** */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 text-center text-white overflow-hidden">
          <Image src="/images/features/minecraft-hero-bg.webp" alt="Blocky, pixelated landscape background for Minecraft logos" layout="fill" objectFit="cover" quality={75} className="z-0 opacity-40 dark:opacity-30" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-green-800/80 via-gray-900/90 to-slate-900/95 z-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <Image
              src="/styles/s701e.webp" // ** A great single Minecraft logo example (e.g., a creeper mascot) **
              alt="An AI-generated Minecraft server logo"
              width={150}
              height={150}
              className="mx-auto mb-6 rounded-lg shadow-2xl border-4 border-green-400/80"
              priority
            />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_50%)]">
              AI <span className="text-green-400">Minecraft Logo</span> Generator
            </h1>
            <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto mb-10 drop-shadow-sm">
              Instantly build a unique logo for your Minecraft server, YouTube channel, or personal brand. From Creeper mascots to pixelated emblems, our AI brings your blocky vision to life!
            </p>
            <button
                onClick={handleStartDesigning}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold rounded-lg text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-green-400/60 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50"
                id="cta-hero-minecraft-to-tool"
            >
              Build Your Minecraft Logo <FaChevronRight className="inline ml-2 -mr-1" />
            </button>
            <p className="mt-4 text-xs text-slate-400">Get 1 free credit on signup to create your first logo.</p>
          </div>
        </section>

        {/* Example Gallery Section */}
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              Explore <span className="text-purple-600 dark:text-cyan-400">AI-Crafted</span> Minecraft Logo Styles
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {minecraftStyleExamples.map((example, index) => (
                <div key={index} className="group relative rounded-lg shadow-lg overflow-hidden aspect-square">
                  <Image src={example.src} alt={example.alt} layout="fill" objectFit="cover" className="transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
                    Create a Custom <span className="text-purple-600 dark:text-cyan-400">Logo for Minecraft</span> in Seconds
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        { title: "1. Enter Name", desc: "Type your server name, gamer tag, or YouTube channel name.", icon: <FaCubes className="h-10 w-10 mx-auto mb-3"/> },
                        { title: "2. Pick a Style", desc: "Choose from Minecraft-inspired styles like Block Emblems, Creeper Mascots, and more.", icon: <FaPaintBrush className="h-10 w-10 mx-auto mb-3"/> },
                        { title: "3. Generate!", desc: "Let our AI build your logo. Download your favorite design instantly.", icon: <FaDownload className="h-10 w-10 mx-auto mb-3"/> }
                    ].map(step => (
                        <div key={step.title} className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                            <div className="text-purple-600 dark:text-cyan-400">{step.icon}</div>
                            <h3 className="text-xl font-semibold my-2 text-slate-800 dark:text-white">{step.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
                        </div>
                    ))}
                </div>
                 <div className="text-center mt-12">
                    <button onClick={handleStartDesigning} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold rounded-lg text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-cyan-500/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50">
                        Start Building Your Logo
                    </button>
                </div>
            </div>
        </section>
        
        {/* FAQ Section (Crucial for SEO) */}
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              Your <span className="text-purple-600 dark:text-cyan-400">Minecraft Logo</span> Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "How can I make a logo for my Minecraft server?",
                  a: "Our AI Minecraft logo generator makes it easy! Simply enter your server name, choose a style like 'Pixel Badge' or 'Creeper Mascot,' and our tool will instantly generate professional-looking options for you. It's perfect for creating a unique Minecraft server logo."
                },
                {
                  q: "Is this a free Minecraft logo maker?",
                  a: "You get 1 free credit when you sign up, which lets you create and download your first logo concept for free! You can generate as many previews as you like to find the perfect design. To create more variations and download high-resolution files, you can purchase additional credit packs."
                },
                {
                  q: "Can I create a Minecraft logo for my YouTube channel?",
                  a: "Yes! This is the perfect tool for making a Minecraft logo for YouTube. You can choose different aspect ratios for your channel art and profile picture. The AI can create cool designs based on Creepers, Endermen, or your own Minecraft skin concept."
                },
                {
                  q: "What types of Minecraft logos can I create?",
                  a: "You can create a wide variety of logos, from a classic Minecraft block logo to a modern esports-style emblem. Our styles include Pickaxe Emblems, Sword Emblems, Animal Mascots, and even designs inspired by the original Minecraft logo or Mojang's style."
                }
              ].map((faq) => (
                <div key={faq.q} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-lg text-slate-800 dark:text-white">{faq.q}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 text-center bg-slate-100 dark:bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Ready to Craft Your Blocky Masterpiece?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto">
              Your server, channel, or personal brand deserves a unique identity. Get started with our AI and build your perfect Minecraft logo today.
            </p>
            <button
              onClick={handleStartDesigning}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-md transition-colors duration-300 shadow-md hover:shadow-lg dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-900"
              id="cta-final-minecraft-to-tool"
            >
              Start Building My Logo!
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default MinecraftLogoLandingPage;