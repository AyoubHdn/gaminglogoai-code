// src/pages/fortnite-pfp-maker.tsx
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "~/component/Button";
import { FaChevronRight, FaCamera, FaPalette, FaMagic } from "react-icons/fa"; // Example Icons
import { s3Style } from "~/utils/s3Paths";

// This array showcases your best photo-to-Fortnite-PFP transformations.
// You need to generate these using your /pfp-tool with Fortnite-related style prompts.
const fortnitePfpExamples = [
  // ** REPLACE these with ACTUAL paths to your best Fortnite PFP example images **
  { src: "/images/showcase/fortnite-pfp-1.webp", alt: "AI generated custom Fortnite PFP in a vibrant cartoon style" },
  { src: "/images/showcase/fortnite-pfp-2.webp", alt: "Custom Fortnite avatar in an anime style from a photo" },
  { src: "/images/showcase/fortnite-pfp-3.webp", alt: "Cool Fortnite PFP for a Discord profile picture" },
  { src: "/images/showcase/fortnite-pfp-4.webp", alt: "User's face transformed into a Fortnite character logo style" },
];

const FortnitePfpMakerLandingPage: NextPage = () => {
  const router = useRouter();

  const handleStartDesigning = () => {
    // Navigate to your actual PFP maker tool page
    // You could add a query param if the tool can pre-select a Fortnite style
    // e.g., void router.push("/pfp-tool?style=fortnite");
    void router.push("/pfp-maker");
  };

  return (
    <>
      <Head>
        <title>Fortnite PFP Maker - Free AI Custom Profile Pictures | GamingLogoAI</title>
        <meta
          name="description"
          content="Create a custom Fortnite PFP from your photo with our free AI generator! Turn your face into a unique Fortnite-style avatar for Discord, YouTube, or Twitch. Try the #1 Fortnite PFP maker now!"
        />
        <meta name="keywords" content="fortnite pfp maker, custom fortnite pfp, fortnite profile picture, free fortnite pfp, fortnite skin pfp maker, fortnite avatar, cool fortnite pfp, fn pfp maker" />
        <link rel="canonical" href="https://gaminglogoai.com/fortnite-pfp-maker" /> {/* ** REPLACE with actual domain ** */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 text-center text-white overflow-hidden">
          <Image src="/face-logo-image.webp" alt="Vibrant background inspired by Fortnite's art style" layout="fill" objectFit="cover" quality={75} className="z-0 opacity-30 dark:opacity-25" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/80 via-purple-900/90 to-slate-900/95 z-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <div className="mb-8 inline-block relative w-40 h-40 sm:w-48 sm:h-48">
                {/* Showcase a before/after */}
                <Image src="/handsome-man.webp" alt="A real person's photo before transformation" width={100} height={100} className="rounded-full absolute top-0 left-0 w-1/2 h-1/2 border-2 border-white shadow-lg" />
                <Image src={s3Style("/styles/ff25.webp")} alt="The same photo transformed into a cool Fortnite PFP" width={200} height={200} className="rounded-full absolute bottom-0 right-0 w-3/4 h-3/4 border-4 border-cyan-400 shadow-xl" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_50%)]">
              AI <span className="text-cyan-400">Fortnite PFP</span> Maker
            </h1>
            <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto mb-10 drop-shadow-sm">
              Turn your photo into a legendary Fortnite-style avatar! Create a custom profile picture for Discord, YouTube, Twitch, and more in seconds.
            </p>
            <button
              onClick={handleStartDesigning}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold rounded-lg text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-cyan-500/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50"
              id="cta-hero-fortnitepfp-to-tool"
            >
              Make Your PFP Now (1 Free Credit) <FaChevronRight className="inline ml-2 -mr-1" />
            </button>
            <p className="mt-4 text-xs text-slate-400">Sign up and use your free credit to download your first PFP!</p>
          </div>
        </section>

        {/* Example Gallery Section */}
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              From Selfie to <span className="text-purple-600 dark:text-cyan-400">Victory Royale Avatar</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {fortnitePfpExamples.map((example, index) => (
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
                    Create Your <span className="text-purple-600 dark:text-cyan-400">Custom Fortnite PFP</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        { title: "1. Upload Your Photo", desc: "Choose a clear, front-facing selfie or picture.", icon: <FaCamera className="h-10 w-10 mx-auto mb-3"/> },
                        { title: "2. Pick a Fortnite Style", desc: "Select from styles like Cartoon, Neon Glitch, Anime, and more inspired by the game.", icon: <FaPalette className="h-10 w-10 mx-auto mb-3"/> },
                        { title: "3. Generate Your PFP", desc: "Let our AI transform your photo into a unique profile picture!", icon: <FaMagic className="h-10 w-10 mx-auto mb-3"/> }
                    ].map(step => (
                        <div key={step.title} className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                            <div className="text-purple-600 dark:text-cyan-400">{step.icon}</div>
                            <h3 className="text-xl font-semibold my-2 text-slate-800 dark:text-white">{step.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* FAQ Section (Crucial for SEO) */}
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              Your <span className="text-purple-600 dark:text-cyan-400">Fortnite PFP</span> Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Is this a free Fortnite PFP maker?",
                  a: "Yes, you can get started for free! Every new user gets 1 free credit. Use it to generate and download your first custom Fortnite profile picture. If you want to create more, you can buy additional credit packs."
                },
                {
                  q: "How do I make my own Fortnite PFP?",
                  a: "It's easy! Just upload a photo of yourself, choose an art style inspired by Fortnite (like cartoon, neon, or a specific skin aesthetic), and our AI PFP creator will do the rest. You can add your gamer tag to make it a custom Fortnite profile picture with your name."
                },
                {
                  q: "Can I use these PFPs on Discord and Twitch?",
                  a: "Absolutely. The high-resolution downloads are perfect for a Fortnite Discord PFP, a Twitch profile picture, or for your YouTube gaming channel. The 1:1 aspect ratio is ideal for all major platforms."
                },
                {
                  q: "Can the AI make a PFP of a specific Fortnite skin?",
                  a: "Our AI creates a unique avatar inspired by your face in the *style* of Fortnite. While it won't replicate a copyrighted skin like Renegade Raider exactly, you can choose styles (e.g., 'tactical', 'colorful') and use prompts to guide the AI towards a similar aesthetic to create your own unique character."
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
                Ready to Level Up Your Profile?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto">
              Stop using default icons. Create a custom Fortnite PFP that shows off your personality.
            </p>
            <button
              onClick={handleStartDesigning}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold rounded-lg text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-cyan-500/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50"
              id="cta-final-fortnitepfp-to-tool"
            >
              Make My PFP with AI
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default FortnitePfpMakerLandingPage;