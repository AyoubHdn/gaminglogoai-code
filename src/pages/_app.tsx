// src/pages/_app.tsx (for GamingLogoAI)
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import Head from "next/head"; // Import Head for default viewport and other site-wide tags

import { api } from "~/utils/api";

import "~/styles/globals.css"; // Your global styles
import { Header } from "~/component/Header"; // Your themed Header for GamingLogoAI
import { Footer } from "~/component/Footer"; // Your themed Footer for GamingLogoAI

// ** REPLACE WITH YOUR NEW GTM ID FOR GAMINGLOGOAI.COM **
const GTM_ID_GAMINGLOGOAI = "GTM-WW8GRHH5"; // Example: GTM-ABC123Z

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        {/* Site-wide defaults - can be overridden by individual pages */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* You could add a default open graph image or site verification tags here if needed */}
      </Head>

      {/* Google Tag Manager Script for GamingLogoAI */}
      <Script
        id="gtm-script-gaminglogoai" // Unique ID for the script tag
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID_GAMINGLOGOAI}');
          `,
        }}
      />
      
      {/* Google Tag Manager NoScript Fallback for GamingLogoAI */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID_GAMINGLOGOAI}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager noscript fallback" // Added title for accessibility
        ></iframe>
      </noscript>

      {/* Main App Structure */}
      <div className="flex flex-col min-h-screen"> {/* Optional: Ensures footer stays at bottom */}
        <Header /> {/* Your themed GamingLogoAI Header */}
        <main className="flex-grow"> {/* Optional: Allows main content to take available space */}
          <Component {...pageProps} />
        </main>
        <Footer /> {/* Your themed GamingLogoAI Footer */}
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);