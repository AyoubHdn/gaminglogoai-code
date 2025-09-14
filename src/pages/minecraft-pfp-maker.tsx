// src/pages/minecraft-pfp-maker.tsx
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "~/component/Button";
import { FaChevronRight, FaCubes, FaCamera, FaDownload } from "react-icons/fa"; // Example Icons

// This array showcases your best photo-to-Minecraft-PFP transformations.
// You need to generate these using your /pfp-tool with Minecraft-related style prompts.
const minecraftPfpExamples = [
  // ** REPLACE these with ACTUAL paths to your best Minecraft PFP example images **
  { src: "/images/showcase/minecraft-pfp-1.webp", alt: "AI generated Minecraft PFP in a blocky, pixelated style" },
  { src: "/images/showcase/minecraft-pfp-2.webp", alt: "Custom Minecraft skin PFP made from a photo using AI" },
  { src: "/images/showcase/minecraft-pfp-3.webp", alt: "Minecraft avatar for a YouTube channel with a Creeper theme" },
  { src: "/images/showcase/minecraft-pfp-4.webp", alt: "Cool Minecraft PFP maker example showing a stylized character" },
];

const MinecraftPfpMakerLandingPage: NextPage = () => {
  const router = useRouter();

  const handleStartDesigning = () => {
    // Navigate to your actual PFP maker tool page
    // Example with query param: void router.push("/pfp-tool?style=minecraft");
    void router.push("/pfp-maker");
  };

  return (
    <>
      <Head>
        <title>Minecraft PFP Maker - Free AI Custom Minecraft Avatars | GamingLogoAI</title>
        <meta
          name="description"
          content="Create a custom Minecraft PFP from your photo with our free AI generator! Turn your face into a unique blocky, pixel art, or skin-style avatar for YouTube, Discord, and more. Try the #1 MC PFP maker!"
        />
        <meta name="keywords" content="minecraft pfp maker, minecraft pfp, custom minecraft pfp, minecraft skin pfp maker, mc pfp maker, minecraft pfp generator, minecraft avatar, free minecraft pfp" />
        <link rel="canonical" href="https://gaminglogoai.com/minecraft-pfp-maker" /> {/* ** REPLACE with actual domain ** */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 text-center text-white overflow-hidden">
          <Image src="/face-logo-image.webp" alt="Blocky, pixelated landscape background for Minecraft PFPs" layout="fill" objectFit="cover" quality={75} className="z-0 opacity-30 dark:opacity-25" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-green-800/80 via-emerald-900/90 to-slate-900/95 z-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <div className="mb-8 inline-block p-2 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg">
                <FaCubes className="h-16 w-16 sm:h-20 sm:w-20 text-green-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_50%)]">
              AI <span className="text-green-400">Minecraft PFP</span> Maker
            </h1>
            <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto mb-10 drop-shadow-sm">
              Build your perfect blocky avatar! Turn your photo into a custom Minecraft-style PFP for your server, YouTube channel, or profile in just a few clicks.
            </p>
            <button
                onClick={handleStartDesigning}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold rounded-lg text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-green-400/60 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50"
                id="cta-hero-minecraftpfp-to-tool"
            >
              Craft Your Minecraft PFP (1 Free Credit) <FaChevronRight className="inline ml-2 -mr-1" />
            </button>
            <p className="mt-4 text-xs text-slate-400">Sign up to get a free credit and download your first PFP!</p>
          </div>
        </section>

        {/* Example Gallery Section */}
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              From Photo to <span className="text-purple-600 dark:text-cyan-400">Pixel Perfect Avatar</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {minecraftPfpExamples.map((example, index) => (
                <div key={index} className="group relative rounded-lg shadow-lg overflow-hidden aspect-square">
                  <Image src={example.src} alt={example.alt} layout="fill" objectFit="cover" className="transition-transform duration-500 group-hover:scale-110" style={{ imageRendering: 'pixelated' }} />
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
                    Your Custom <span className="text-purple-600 dark:text-cyan-400">MC PFP</span> in 3 Easy Steps
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        { title: "1. Upload Your Photo", desc: "Choose a clear selfie or picture to transform.", icon: <FaCamera className="h-10 w-10 mx-auto mb-3"/> },
                        { title: "2. Pick a Minecraft Style", desc: "Select from styles like Pixel Art, Blocky, or Skin-inspired themes.", icon: <FaCubes className="h-10 w-10 mx-auto mb-3"/> },
                        { title: "3. Generate Your PFP", desc: "Our AI crafts your avatar. Download and show it off!", icon: <FaDownload className="h-10 w-10 mx-auto mb-3"/> }
                    ].map(step => (
                        <div key={step.title} className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                            <div className="text-purple-600 dark:text-cyan-400">{step.icon}</div>
                            <h3 className="text-xl font-semibold my-2 text-slate-800 dark:text-white">{step.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
                        </div>
                    ))}
                </div>
                 <div className="text-center mt-12">
                    <button onClick={handleStartDesigning} className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-md transition-colors duration-300 shadow-md hover:shadow-lg dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-900">
                        Start with Your Free Credit
                    </button>
                </div>
            </div>
        </section>

        {/* FAQ Section (Crucial for SEO) */}
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              Your <span className="text-purple-600 dark:text-cyan-400">Minecraft PFP</span> Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "How can I make a Minecraft PFP for free?",
                  a: "You can create and download your first Minecraft PFP for free! New users get 1 free credit to try our AI generator. You can generate unlimited previews to find the perfect blocky look before you decide to download."
                },
                {
                  q: "Does this work as a Minecraft skin PFP maker?",
                  a: "Yes! While our AI transforms your actual photo, you can choose styles that mimic the blocky, pixelated aesthetic of a Minecraft skin. It's a great way to create a PFP that looks like a custom skin based on you."
                },
                {
                  q: "Is this tool a good Minecraft PFP generator for YouTube?",
                  a: "Absolutely. Our generator creates high-resolution, square (1:1) PFPs that are perfect for your Minecraft YouTube channel, Discord server, or any social media profile. The unique AI-generated style will help your channel stand out."
                },
                {
                  q: "Can I create a pixel art PFP?",
                  a: "Yes! We have specific 'Pixel Art' and '8-bit' styles in our PFP maker. Just upload your photo, select one of these styles, and our AI will generate a cool pixel art PFP based on your face."
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
                Ready to Build Your New Look?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto">
              Don&apos;t settle for a default skin. Craft a custom, AI-powered Minecraft PFP that&apos;s uniquely you.
            </p>
            <button
              onClick={handleStartDesigning}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold rounded-lg text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-cyan-500/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50"
              id="cta-final-minecraftpfp-to-tool"
            >
              Craft My Minecraft PFP with AI
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default MinecraftPfpMakerLandingPage;