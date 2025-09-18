// src/pages/ai-profile-picture-maker.tsx
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaChevronRight, FaUserAstronaut, FaCameraRetro, FaMagic, FaPalette, FaQuestionCircle, FaUserCheck, FaSmileBeam, FaShieldVirus, FaBolt, FaGamepad } from "react-icons/fa"; // Example Icons, added FaCameraRetro

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

  function TestimonialSection() {
  // ** REPLACE with actual or plausible PFP/Avatar-specific testimonials **
  const testimonials = [
    { 
      quote: "I uploaded a simple selfie and got this insane Fortnite-style avatar for my Twitch profile. My viewers love it! This AI PFP maker is magic.", 
      name: "Cybr_Grl", 
      role: "Twitch Streamer",
      image: "/images/showcase/fortnite-pfp-2.webp" // ** CREATE a 100x100 example PFP **
    },
    { 
      quote: "Finally, a gaming profile picture that actually looks like me but in a cool cartoon style. Took less than a minute to create.", 
      name: "Deadshot_Dave", 
      role: "Discord Community Admin",
      image: "/styles/f25.webp" // ** CREATE a 100x100 example PFP **
    },
    { 
      quote: "The Minecraft style is top-notch! I made a new PFP for my YouTube and Instagram and got so many compliments.", 
      name: "BlockyKat", 
      role: "Content Creator",
      image: "/images/showcase/minecraft-pfp-3.webp" // ** CREATE a 100x100 example PFP **
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-slate-800">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
          Trusted by <span className="text-purple-600 dark:text-cyan-400">Gamers & Creators</span> Like You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 flex flex-col text-center"
            >
              <Image
                src={testimonial.image}
                alt={`AI generated PFP for ${testimonial.name}`}
                width={80}
                height={80}
                className="rounded-full mx-auto mb-4 border-4 border-white dark:border-slate-600 shadow-md"
              />
              <blockquote className="text-slate-600 dark:text-slate-300 italic mb-4 grow text-base leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </blockquote>
              <footer className="font-semibold text-slate-700 dark:text-slate-200">
                {testimonial.name} 
                <span className="block text-sm text-purple-500 dark:text-cyan-400 font-normal">
                  {testimonial.role}
                </span>
              </footer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

  function FaqSection() {
    const faqItems = [
        {
          q: "What is an AI PFP Maker?",
          a: "An AI PFP (Profile Picture) Maker uses artificial intelligence to transform your uploaded photo into a new, stylized image. Our tool is specifically a gaming PFP maker, designed to create avatars in popular styles like cartoon, anime, fantasy, and more, perfect for your online identity."
        },
        {
          q: "How can I make a gaming profile picture for free?",
          a: "You can start for free with GamingLogoAI! Every new user gets 1 free credit. This credit is enough to generate and download your first high-resolution custom PFP without a watermark. If you want more designs, you can purchase additional credit packs."
        },
        {
          q: "Can I turn my photo into a logo?",
          a: "Yes! Our tool is both an avatar creator and a photo to logo converter. By selecting more abstract or emblem-based styles, the AI can transform your face into a unique, stylized logo that you can use for your personal brand or team."
        },
        {
          q: "What styles are available?",
          a: "Our AI profile picture generator offers a wide range of styles, including vibrant cartoon, classic anime, gritty cyberpunk, heroic fantasy, clean vector art, and even transformations inspired by games like Fortnite or Valorant. Explore all the options in our tool!"
        }
    ];

    return (
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
                <FaQuestionCircle className="inline-block mr-3 align-middle text-purple-600 dark:text-cyan-400" />
                Your <span className="text-purple-600 dark:text-cyan-400">PFP Maker</span> Questions
            </h2>
            <div className="space-y-4">
                {faqItems.map((item, index) => (
                    <details 
                      key={index} 
                      className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm cursor-pointer group border border-slate-200 dark:border-slate-700"
                      open={index === 0} // Open the first FAQ by default
                    >
                        <summary className="font-semibold text-lg text-slate-800 dark:text-white flex justify-between items-center list-none">
                            <span>{item.q}</span>
                            <span className="transform transition-transform duration-300 group-open:rotate-180 ml-2">
                                <svg className="h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </summary>
                        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-700 pt-3">
                            <p>{item.a}</p>
                        </div>
                    </details>
                ))}
            </div>
          </div>
        </section>
    );
}


  return (
    <>
      <Head>
        <title>AI Profile Picture Maker - Custom Gaming PFP Generator</title>
        <meta
          name="description"
          content="Create a custom gaming PFP from your photo with GamingLogoAI. Transform your image into unique cartoon, anime, or esports styles. Get 1 free credit today!"
        />
        <meta name="keywords" content="ai profile picture maker, gaming profile picture maker, gaming pfp maker, custom pfp, photo to avatar, ai avatar generator, image to pfp, streamer avatar" />  
        <link rel="canonical" href="https://gaminglogoai.com/ai-profile-picture-maker" />
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
              The Ultimate <span className="text-cyan-400">AI Profile Picture Maker</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto mb-10 drop-shadow-sm">
              Transform your photo into a legendary avatar with our **gaming PFP maker**. Choose an art style, upload your pic, and let our AI create a unique look for your stream or social profiles.            
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

        <TestimonialSection />
        <FaqSection /> 

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