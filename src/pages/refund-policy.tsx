// src/pages/refund-policy.tsx (or refund.tsx, ensure consistent naming with links)
import Head from "next/head";
import Link from "next/link"; // Import Link

const RefundPolicyPage: React.FC = () => {
  const siteName = "Gaming Logo AI";
  const siteUrl = "https://www.gaminglogoai.com"; // Replace with actual live domain
  const contactEmail = "support@gaminglogoai.com"; // Replace with actual support email
  const communityPageUrl = "/community"; // URL to your community page

  // Get current year for "Last updated"
  const currentYear = new Date().getFullYear();
  // You might want a more specific last updated date if the policy changes often.
  const lastUpdatedDate = `January 1, ${currentYear}`; // Or more specific

  return (
    <>
      <Head>
        <title>Refund Policy - {siteName}</title>
        <meta
          name="description"
          content={`Learn about the refund policy for credit purchases on ${siteName}. Understand terms before buying credits for your AI gaming logos.`}
        />
        <meta name="keywords" content="refund policy, gaming logo ai refunds, credit purchase policy, no refunds, ai design costs" />
        <link rel="canonical" href={`${siteUrl}/refund-policy`} /> {/* Or /refund if that's your URL */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Main background: dark slate, text: light slate/white */}
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
              At {siteName}, we are committed to helping you create awesome AI-generated gaming logos.
              The generation of these designs involves significant computational resources and associated costs.
              Therefore, our policy regarding refunds is as follows:
            </p>

            <h2>No Refunds on Used Credits</h2>
            <p>
              Once credits have been purchased and used to generate logos on {siteName}, we are unable to offer refunds.
              This is due to the irreversible computational costs incurred during the AI generation process for each design you create.
            </p>
            <p>
              Each time you initiate a logo generation, credits are consumed, and our AI systems perform complex tasks to deliver your unique designs. These processes have direct operational costs.
            </p>

            <h2>Before You Buy Credits</h2>
            <p>
              We strongly encourage you to:
            </p>
            <ul>
              <li>
                <strong>Utilize any free trial credits or features</strong> (if offered) to test the capabilities of our AI logo generator.
              </li>
              <li>
                Explore examples on our <Link href={communityPageUrl}>Community Showcase</Link> page to get a good understanding of the style and quality of logos our AI can produce.
              </li>
              <li>
                Understand that AI generation can sometimes be unpredictable. While we strive for high-quality results, the creative output can vary. Experimenting with different prompts and styles is part of the process.
              </li>
            </ul>
            <p>
                By purchasing credits, you acknowledge and agree to this refund policy.
            </p>

            <h2>Exceptional Circumstances</h2>
            <p>
              While our general policy is no refunds on used credits, if you experience a verifiable technical issue directly caused by our platform that prevents you from receiving your generated logos after credits were deducted, please contact our support team. We will investigate such cases on an individual basis. Accidental purchases of credit packs, if no credits from that pack have been used, may be considered for a refund at our sole discretion if reported promptly.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions or concerns about our Refund Policy, please do not hesitate to reach out to us:
            </p>
            <ul>
              <li>
                By email:{" "}
                <a href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
              </li>
            </ul>
            <p className="mt-8 text-center">
                <Link href="/buy-credits"  className="inline-block px-6 py-3 font-semibold rounded-lg transition-all duration-300 ease-in-out
                                  bg-purple-600 hover:bg-purple-700 text-white
                                  dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-900
                                  shadow-md hover:shadow-lg">
                        View Credit Plans
                </Link>
            </p>
          </article>
        </div>
      </main>
    </>
  );
};

export default RefundPolicyPage;