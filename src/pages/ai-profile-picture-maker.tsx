// src/pages/ai-profile-picture-maker.tsx
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaChevronRight, FaUserAstronaut, FaCameraRetro, FaMagic, FaPalette, FaDownload, FaUserCheck, FaSmileBeam, FaShieldVirus, FaBolt, FaGamepad } from "react-icons/fa"; // Example Icons, added FaCameraRetro

const AIPFPGeneratorLandingPage: NextPage = () => {
  const router = useRouter();

  const handleStartCreating = () => {
    // Navigate to your actual PFP maker tool page
    void router.push("/pfp-maker"); 
  };

  const features = [
    { title: "Your Face, Your Avatar", description: "Upload any photo and watch our AI transform it into a unique, stylized PFP or gaming avatar.", icon: <FaUserAstronaut className="h-10 w-10" /> },
    { title: "Diverse Art Styles", description: "Become a cartoon, anime hero, cyberpunk rebel, fantasy character, and more! Endless possibilities.", icon: <FaPalette className="h-10 w-10" /> },
    { title: "Add Your Gamer Tag", description: "Optionally integrate your name or text artfully into your new PFP.", icon: <FaMagic className="h-10 w-10" /> },
    { title: "High-Res & Profile Ready", description: "Get stunning, high-resolution PFPs perfectly sized for Discord, Twitch, YouTube, and social media.", icon: <FaUserCheck className="h-10 w-10" /> },
    { title: "Simple & Instant", description: "No complicated software. Upload, pick a style, and generate in moments.", icon: <FaBolt className="h-10 w-10" /> }, // Reusing FaBolt
    { title: "Safe & Secure", description: "We prioritize your privacy. Your uploaded photos are processed securely and not stored long-term without consent.", icon: <FaShieldVirus className="h-10 w-10" /> },
  ];

  // ** YOU NEED TO CREATE THESE EXAMPLE IMAGES **
  // Show before/after if possible, or just the AI-generated results from example faces
  const exampleTransformations = [
    { src: "/styles/f4.webp", alt: "Example of a photo transformed into a cartoon PFP", caption: "Cartoon Style PFPs" },
    { src: "/styles/f32.webp", alt: "Example of a photo transformed into an anime avatar", caption: "Anime Character Avatars" },
    { src: "/styles/f22.webp", alt: "Example of a photo transformed into a cyberpunk PFP", caption: "Cyberpunk Your Face" },
    { src: "/styles/f21.webp", alt: "Example of a photo transformed into a fantasy PFP", caption: "Fantasy Hero Portraits" },
  ];

  const testimonials = [
      { quote: "Turned my selfie into an epic anime avatar for my Discord! So cool!", name: "LunarKat", role: "Discord Mod" },
      { quote: "Finally, a PFP that actually looks like me but way more awesome for my stream.", name: "StreamGod", role: "Twitch Streamer" },
      { quote: "The AI styles are incredible. Made a bunch of different PFPs for all my socials.", name: "GamerX", role: "Community Member" },
  ];


  return (
    <>
      <Head>
        <title>AI Profile Picture Maker - Custom PFP from Photo | GamingLogoAI</title>
        <meta
          name="description"
          content="Create unique AI-generated profile pictures (PFPs) and gaming avatars from your photos! GamingLogoAI transforms your image into cartoon, anime, cyberpunk styles, and more. Try free!"
        />
        <meta name="keywords" content="ai profile picture maker, pfp maker, photo to avatar, custom gaming pfp, ai avatar generator, image to pfp, personalized avatar" />
        <link rel="canonical" href="https://gaminglogoai.com/ai-profile-picture-maker" /> {/* ** REPLACE with your actual domain ** */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 text-center text-white overflow-hidden">
          <Image src="/images/pfp-hero-bg.webp" alt="Abstract background for AI PFP Maker" layout="fill" objectFit="cover" quality={75} className="z-0 opacity-25 dark:opacity-15" priority unoptimized={true} />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-950/90 to-slate-900/95 z-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            {/* Optional: A visual element showing a photo transforming into a PFP */}
            <div className="mb-8 inline-block p-2 bg-white/10 backdrop-blur-sm rounded-full">
                <FaCameraRetro className="h-16 w-16 sm:h-20 sm:w-20 text-cyan-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              AI Profile Picture & <span className="text-cyan-400">Avatar Maker</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto mb-10 drop-shadow-sm">
              Transform your photo into an amazing, AI-generated PFP or gaming avatar! Choose a style, upload your pic, and get a unique look in seconds.
            </p>
            <button
              onClick={handleStartCreating}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold rounded-lg text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50"
              id="cta-hero-to-pfp-tool"
            >
              Create Your AI PFP Now <FaChevronRight className="inline ml-2 -mr-1" />
            </button>
            <p className="mt-4 text-xs text-slate-400">Free previews. Credits for high-res downloads.</p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
                    Your Photo, Reimagined in <span className="text-purple-600 dark:text-cyan-400">Minutes</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    {[
                        { title: "1. Upload Photo", desc: "Pick a clear, front-facing photo of yourself.", icon: <FaCameraRetro className="h-10 w-10 mx-auto mb-3"/> },
                        { title: "2. Add Text (Optional)", desc: "Include your gamer tag or name.", icon: <FaGamepad className="h-10 w-10 mx-auto mb-3"/> },
                        { title: "3. Choose Art Style", desc: "Select from cartoon, anime, fantasy, and more.", icon: <FaPalette className="h-10 w-10 mx-auto mb-3"/> },
                        { title: "4. Generate!", desc: "Let our AI craft your unique PFP or avatar.", icon: <FaMagic className="h-10 w-10 mx-auto mb-3"/> }
                    ].map(step => (
                        <div key={step.title} className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-transparent hover:border-purple-300 dark:hover:border-cyan-400 transition-all">
                            <div className="text-purple-600 dark:text-cyan-400">{step.icon}</div>
                            <h3 className="text-xl font-semibold my-2 text-slate-800 dark:text-white">{step.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                    Why Create Your PFP with <span className="text-purple-600 dark:text-cyan-400">GamingLogoAI</span>?
                </h2>
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

        {/* Example Showcase Section */}
        <section className="py-16 md:py-20 bg-slate-100 dark:bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              Transformations That <span className="text-purple-600 dark:text-cyan-400">Speak Volumes</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {exampleTransformations.map((example) => ( 
                <div key={example.caption} className="group relative rounded-lg shadow-lg overflow-hidden aspect-square">
                    <Image src={example.src} alt={example.alt} layout="fill" objectFit="cover" className="transition-transform duration-500 group-hover:scale-110" unoptimized={true}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-white drop-shadow-md">{example.caption}</h3>
                    </div>
                </div>
               ))}
            </div>
            <div className="text-center mt-12">
                <button onClick={handleStartCreating} className="px-8 py-3 font-semibold rounded-lg transition-all duration-300 ease-in-out
                                  border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white
                                  dark:border-cyan-500 dark:text-cyan-400 dark:hover:bg-cyan-500 dark:hover:text-slate-900">
                    Create My Own AI Avatar
                </button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-20 bg-white dark:bg-slate-800">
             {/* ... Similar Testimonials structure as GamingLogo landing page, but use PFP/Avatar specific testimonials ... */}
        </section>


        {/* Final CTA Section */}
        <section className="py-16 md:py-24 text-center bg-gradient-to-tr from-indigo-900 via-purple-950 to-slate-900 text-white">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready for Your AI Avatar Closeup?</h2>
            <p className="text-lg text-slate-200 mb-10 max-w-xl mx-auto">
              Upload your photo and let our AI create a stunning, personalized PFP that defines your online persona.
            </p>
            <button
              onClick={handleStartCreating}
              className="px-10 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-bold rounded-lg text-xl hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-cyan-400/60 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50"
              id="cta-final-to-pfp-tool"
            >
              Make My PFP with AI!
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default AIPFPGeneratorLandingPage;