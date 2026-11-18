// src/pages/refund-policy.tsx (or your chosen URL slug, e.g., /refund)
import Head from "next/head";
import Link from "next/link"; // Import Link for internal navigation

const RefundPolicyPage: React.FC = () => {
  const siteName = "Gaming Logo AI"; // NEW BRAND NAME
  const siteUrl = "https://gaminglogoai.com"; // ** REPLACE with your actual live domain for GamingLogoAI **
  const contactEmail = "support@gaminglogoai.com"; // ** REPLACE with GamingLogoAI's support email **
  const communityPageUrl = "/community"; // URL to GamingLogoAI's community page

  // You'll want to set a realistic "Last updated" date.
  // For this example, I'll use a placeholder or current date.
  const lastUpdatedDate = "May 16, 2024"; // Example: Or new Date().toLocaleDateString(...)

  return (
    <>
      <Head>
        <title>Refund Policy - {siteName}</title>
        <meta
          name="description"
          content={`Understand our refund policy at ${siteName}. Learn about terms for credit purchases for AI-generated gaming logos.`}
        />
        <meta name="keywords" content="refund policy, gaming logo ai refunds, credit purchase terms, no refunds on used credits" />
        <link rel="canonical" href={`${siteUrl}/refund-policy`} /> {/* Adjust slug if needed */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center py-16 sm:py-24 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
        <div className="w-full max-w-3xl px-4 sm:px-6">
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Refund Policy
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Last updated: <strong>{lastUpdatedDate}</strong>
            </p>
          </header>

          <article className="prose prose-lg lg:prose-xl dark:prose-invert mx-auto
                              prose-headings:text-slate-800 dark:prose-headings:text-white
                              prose-a:text-purple-600 dark:prose-a:text-cyan-400 hover:prose-a:underline
                              prose-strong:text-slate-700 dark:prose-strong:text-slate-100">
            <p>
              At {siteName}, we strive to provide high-quality AI-generated designs. However,
              due to the inherent nature of AI and the costs involved, we are unable to offer
              refunds once credits are used.
            </p>
            <p>
              We encourage you to explore examples on our <Link href={communityPageUrl}>community page</Link> to better understand the
              capabilities and limitations of AI-generated designs.
            </p>

            <h2>Key Points</h2>
            <ul>
              <li>
                Refunds are not provided once credits have been used due to the computational costs
                involved.
              </li>
              <li>
                Ensure you review our examples and understand the AI&apos;s limitations before making a
                purchase.
              </li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              If you have any questions or concerns about this policy, you can reach us at:
            </p>
            <p>
              <a href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
            </p>

             <div className="mt-12 text-center not-prose"> {/* Added not-prose to prevent prose styling on button container */}
                <Link href="/buy-credits" legacyBehavior={false}
                    className="inline-block px-6 py-3 font-semibold rounded-lg transition-all duration-300 ease-in-out
                                  bg-purple-600 hover:bg-purple-700 text-white
                                  dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-900
                                  shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-purple-500 dark:focus:ring-cyan-400">
                        View Credit Plans
                    
                </Link>
            </div>
          </article>
        </div>
      </main>
    </>
  );
};

export default RefundPolicyPage;