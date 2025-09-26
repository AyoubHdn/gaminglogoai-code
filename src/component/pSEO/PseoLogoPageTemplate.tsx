// src/components/pSEO/PseoLogoPageTemplate.tsx
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaChevronRight, FaMagic, FaPaintBrush, FaBolt, FaUsers, FaShieldAlt, FaCogs, FaQuestionCircle } from "react-icons/fa";
import { RelatedItem } from '~/lib/pSEO';

// Define the "contract" for what every pSEO page needs to provide
export interface PseoLogoPageTemplateProps {
  pageTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  h1: React.ReactNode; // Using React.ReactNode to allow for JSX like <span>
  heroImageSrc: string;
  introParagraph: React.ReactNode;
  ctaText: string;
  handleCtaClick: () => void;
  showcaseTitle: React.ReactNode;
  imageShowcaseGrid: { src: string; alt: string }[];
  relatedItems: RelatedItem[]; 
  // NEW: Add dynamic titles for these sections
  faqTitle: React.ReactNode;
  finalCtaTitle: React.ReactNode;
  faqItems: { q: string; a: string }[];
}

const PseoLogoPageTemplate: React.FC<PseoLogoPageTemplateProps> = ({
  pageTitle, metaDescription, keywords, canonicalUrl, h1, heroImageSrc,
  introParagraph, ctaText, handleCtaClick, showcaseTitle, imageShowcaseGrid,
  relatedItems, faqItems, faqTitle, finalCtaTitle
}) => {
  
  const commonFeatures = [
    { title: "AI-Powered Engine", description: "Harness advanced AI to generate countless unique logo concepts in seconds.", icon: <FaMagic className="h-10 w-10" /> },
    { title: "Vast Style Library", description: "Explore styles from top games, art genres, themes, mascots, and more.", icon: <FaPaintBrush className="h-10 w-10" /> },
    { title: "Instant Generation", description: "No waiting. See your logo ideas immediately and iterate on the fly.", icon: <FaBolt className="h-10 w-10" /> },
    { title: "For Every Gamer", description: "Perfect for esports teams, Twitch streamers, YouTube channels, or personal branding.", icon: <FaUsers className="h-10 w-10" /> },
    { title: "Easy Customization", description: "Input your text, pick styles, and let the AI craft your vision.", icon: <FaCogs className="h-10 w-10" /> },
    { title: "Pro-Quality Downloads", description: "Get high-resolution, transparent PNGs ready for any platform.", icon: <FaShieldAlt className="h-10 w-10" /> },
  ];

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.webp" />
      </Head>

      <main className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 text-center text-white overflow-hidden">
          <Image src="/gaminglogo-ai-banner.webp" alt="Abstract gaming background" layout="fill" objectFit="cover" quality={75} className="z-0 opacity-30 dark:opacity-20" priority unoptimized={true} />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-indigo-950/80 to-slate-900/90 z-10"></div>
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            {/* FIXED: The 'alt' for an image should be a string, not ReactNode. Let's make a string version of the h1 */}
            <Image src={heroImageSrc} alt={pageTitle} width={140} height={140} className="mx-auto mb-6 transform transition-transform duration-500 hover:scale-110 rounded-full object-cover" priority unoptimized={true} />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">{h1}</h1>
            <div className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto mb-10 drop-shadow-sm">{introParagraph}</div>
            <button onClick={handleCtaClick} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold rounded-lg text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-cyan-500/50">
              {ctaText} <FaChevronRight className="inline ml-2 -mr-1" />
            </button>
          </div>
        </section>

        {/* Dynamic Example Showcase Section */}
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">{showcaseTitle}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageShowcaseGrid.map((image, index) => (
                <div key={index} className="group relative rounded-lg shadow-lg overflow-hidden aspect-square">
                  <Image src={image.src} alt={image.alt} layout="fill" objectFit="cover" className="transition-transform duration-500 group-hover:scale-110" unoptimized={true} />
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
                    Level Up Your Brand with <span className="text-purple-600 dark:text-cyan-400">AI Precision</span>
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Our intelligent logo generator offers everything you need to stand out.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {commonFeatures.map((feature) => (
                <div key={feature.title} className="flex p-6 bg-slate-50 dark:bg-slate-800/60 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700/50">
                  <div className="flex-shrink-0 mr-5 text-purple-600 dark:text-cyan-400">
                    {feature.icon}
                  </div>
                  <div>
                    <p className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
                      <strong>{feature.title}</strong>
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Styles/Games Logo Maker Section */}
        <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              Explore Other <span className="text-purple-600 dark:text-cyan-400">Gaming Logo Styles</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedItems.map((item) => (
                <Link key={item.slug} href={`/${item.tool}/${item.categoryPath}/${item.slug}`} className="block p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center group">
                  <Image src={item.exampleImage} alt={`${item.name} logo example`} width={64} height={64} className="rounded-lg mr-4 object-cover" unoptimized={true} />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-400">{item.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                  <FaChevronRight className="text-slate-400 group-hover:text-purple-600 dark:group-hover:text-cyan-400 ml-4" />
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
                <FaQuestionCircle className="inline-block mr-2 align-middle text-purple-600 dark:text-cyan-400" />
                {/* FIXED: Using the new faqTitle prop */}
                {faqTitle}
            </h2>
            <div className="space-y-6">
              {/* FIXED: Mapping over the correct `faqItems` prop */}
              {faqItems.map((item, index) => (
                <details 
                  key={index} 
                  className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 group cursor-pointer"
                  open={index === 0}
                >
                  <summary className="font-semibold text-lg text-slate-800 dark:text-white flex justify-between items-center list-none">
                    <span>{item.q}</span>
                    <span className="transform transition-transform duration-300 group-open:rotate-180 ml-2">
                      <svg className="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
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

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 text-center bg-gradient-to-tr from-indigo-900 via-purple-950 to-slate-900 text-white">
          <div className="container mx-auto px-4 sm:px-6">
            {/* FIXED: Using the new finalCtaTitle prop */}
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">{finalCtaTitle}</h2>
            <p className="text-lg text-slate-200 mb-10 max-w-xl mx-auto">
              Our AI is ready to craft a professional logo that sets you apart. Start designing with your free credit now!
            </p>
            {/* FIXED: Using the generic handleCtaClick prop and ctaText prop */}
            <button
              onClick={handleCtaClick}
              className="px-10 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-bold rounded-lg text-xl hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-cyan-400/60"
              id="cta-final-to-generator-tool-bottom"
            >
              {ctaText}
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default PseoLogoPageTemplate;