// src/components/pSEO/PseoPfpPageTemplate.tsx
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaChevronRight, FaCamera, FaPalette, FaMagic } from "react-icons/fa";
import { RelatedItem } from '~/lib/pSEO'; // We'll reuse the RelatedItem type

// Define the props our new template will accept
export interface PseoPfpPageTemplateProps {
  pageTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;

  h1: React.ReactNode;
  heroBeforeImageSrc: string;
  heroAfterImageSrc: string;
  introParagraph: React.ReactNode;
  ctaText: string;
  handleCtaClick: () => void;

  showcaseTitle: React.ReactNode;
  imageShowcaseGrid: { src: string; alt: string }[];
  
  howItWorksTitle: React.ReactNode;
  
  faqTitle: React.ReactNode;
  faqItems: { q: string; a: string }[];
  
  finalCtaTitle: React.ReactNode;
  finalCtaParagraph: React.ReactNode;
  
  relatedItems: RelatedItem[];
}

const PseoPfpPageTemplate: React.FC<PseoPfpPageTemplateProps> = ({
  pageTitle, metaDescription, keywords, canonicalUrl, h1,
  heroBeforeImageSrc, heroAfterImageSrc, introParagraph, ctaText, handleCtaClick,
  showcaseTitle, imageShowcaseGrid, howItWorksTitle,
  faqTitle, faqItems, finalCtaTitle, finalCtaParagraph, relatedItems
}) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 text-center text-white overflow-hidden">
          <Image src="/face-logo-image.webp" alt="Vibrant background inspired by gaming art styles" layout="fill" objectFit="cover" quality={75} className="z-0 opacity-30 dark:opacity-25" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/80 via-purple-900/90 to-slate-900/95 z-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <div className="mb-8 inline-block relative w-40 h-40 sm:w-48 sm:h-48">
                {/* DYNAMIC: Using props for before/after images */}
                <Image src={heroBeforeImageSrc} alt="A real person's photo before transformation" width={100} height={100} className="rounded-full absolute top-0 left-0 w-1/2 h-1/2 border-2 border-white shadow-lg" />
                <Image src={heroAfterImageSrc} alt="The same photo transformed into a cool PFP" width={200} height={200} className="rounded-full absolute bottom-0 right-0 w-3/4 h-3/4 border-4 border-cyan-400 shadow-xl" />
            </div>
            {/* DYNAMIC: Using H1 and Intro Paragraph props */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_50%)]">
              {h1}
            </h1>
            <div className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto mb-10 drop-shadow-sm">
              {introParagraph}
            </div>
            {/* DYNAMIC: Using CTA props */}
            <button
              onClick={handleCtaClick}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold rounded-lg text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-cyan-500/50"
            >
              {ctaText} <FaChevronRight className="inline ml-2 -mr-1" />
            </button>
            <p className="mt-4 text-xs text-slate-400">Sign up and use your free credit to download your first PFP!</p>
          </div>
        </section>

        {/* Example Gallery Section */}
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6">
            {/* DYNAMIC: Using showcase title prop */}
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              {showcaseTitle}
            </h2>
            {/* DYNAMIC: Using image grid prop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageShowcaseGrid.map((example, index) => (
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
                {/* DYNAMIC: Using How It Works title prop */}
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
                    {howItWorksTitle}
                </h2>
                {/* STATIC: The steps are generic for all PFP makers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        { title: "1. Upload Your Photo", desc: "Choose a clear, front-facing selfie or picture.", icon: <FaCamera className="h-10 w-10 mx-auto mb-3"/> },
                        { title: "2. Pick a Style", desc: "Select from dozens of styles inspired by games, art, and more.", icon: <FaPalette className="h-10 w-10 mx-auto mb-3"/> },
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

        {/* Related Items Section (Placeholder for now) */}
        {relatedItems.length > 0 && (
          <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
                Explore Other <span className="text-purple-600 dark:text-cyan-400">PFP Styles</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedItems.map((item) => (
                  <Link key={item.slug} href={`/${item.tool}/${item.categoryPath}/${item.slug}`} className="block p-4 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center group">
                    <Image src={item.exampleImage} alt={`${item.name} logo example`} width={64} height={64} className="rounded-lg mr-4 object-cover" unoptimized={true} />
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-400">{item.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
            {/* DYNAMIC: Using FAQ title prop */}
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              {faqTitle}
            </h2>
            {/* DYNAMIC: Using FAQ items prop */}
            <div className="space-y-6">
              {faqItems.map((faq) => (
                <div key={faq.q} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-lg text-slate-800 dark:text-white">{faq.q}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 text-center bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6">
            {/* DYNAMIC: Using Final CTA props */}
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                {finalCtaTitle}
            </h2>
            <div className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto">
              {finalCtaParagraph}
            </div>
            <button
              onClick={handleCtaClick}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold rounded-lg text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-cyan-500/50"
            >
              {ctaText}
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default PseoPfpPageTemplate;