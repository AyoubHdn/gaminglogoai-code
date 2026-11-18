// src/pages/terms-of-service.tsx (or your chosen URL slug for GamingLogoAI)
import Head from "next/head";
import Link from "next/link";

const TermsOfServicePage: React.FC = () => {
  const siteName = "Gaming Logo AI";
  const siteUrl = "https://gaminglogoai.com"; // Replace with actual live domain
  const contactEmail = "support@gaminglogoai.com"; // Replace with actual support email
  const companyName = "HDN STUDIO LTD"; // Assuming this remains the same
  const companyAddress = "71-75 Shelton Street, Covent Garden, London, WC2H 9JQ";
  const refundPolicyUrl = "/refund-policy"; // Ensure this matches your refund policy page URL

  // Get current year for "Last updated"
  const currentYear = new Date().getFullYear();
  const lastUpdatedDate = `January 1, ${currentYear}`; // Or more specific

  return (
    <>
      <Head>
        <title>Terms of Service - {siteName}</title>
        <meta
          name="description"
          content={`Review the Terms of Service for using ${siteName}. Understand your rights and responsibilities when using our AI gaming logo generator.`}
        />
        <meta name="keywords" content="terms of service, terms and conditions, gaming logo ai terms, user agreement, legal" />
        <link rel="canonical" href={`${siteUrl}/terms-of-service`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Main background: dark slate, text: light slate/white */}
      <main className="flex min-h-screen flex-col items-center py-16 sm:py-24 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
        <div className="w-full max-w-3xl px-4 sm:px-6">
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Last updated: <strong>{lastUpdatedDate}</strong>
            </p>
          </header>

          <article className="prose prose-lg lg:prose-xl dark:prose-invert mx-auto
                              prose-headings:text-slate-800 dark:prose-headings:text-white
                              prose-a:text-purple-600 dark:prose-a:text-cyan-400 hover:prose-a:underline
                              prose-strong:text-slate-700 dark:prose-strong:text-slate-100">
            <h2>1. Introduction & Agreement to Terms</h2>
            <p>
              Welcome to {siteName}! These Terms of Service (&quot;Terms&quot;) govern your access to and use of the {siteName}
              website (the &quot;Website&quot;), our AI-powered gaming logo generation services, and any related content or features
              (collectively, the &quot;Service&quot;) provided by {companyName} (&quot;Company&quot;, &quot;We&quot;, &quot;Us&quot;, or &quot;Our&quot;).
            </p>
            <p>
              By accessing or using our Service, you signify that you have read, understood, and agree to be bound by these Terms
              and our <Link href="/privacy-policy">Privacy Policy</Link>. If you do not agree with these Terms or the Privacy Policy,
              you must not access or use the Service.
            </p>

            <h2>2. Service Description</h2>
            <p>
              {siteName} provides an AI-powered platform that allows users to generate custom gaming logos based on textual prompts
              and style selections. Users can purchase credits to generate and download these logos.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              To access certain features of the Service, including generating and saving logos, you may be required to create an account.
              You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              You agree to notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts
              that violate these Terms.
            </p>

            <h2>4. Credits and Payments</h2>
            <p>
              The Service operates on a credit-based system. You may purchase credits through the Website. All payments are processed
              through third-party payment processors (e.g., Stripe). We do not store your full credit card information.
            </p>
            <p>
              By purchasing credits, you agree to our <Link href={refundPolicyUrl}>Refund Policy</Link>. Please review it carefully.
              Credits are non-transferable and typically have no cash value outside of their use on the Service.
            </p>

            <h2>5. Use of Generated Logos & Intellectual Property</h2>
            <p>
              Subject to your compliance with these Terms and purchase of necessary credits, We grant you a license to use the logos
              you generate through the Service (&quot;Generated Content&quot;) for your personal and commercial purposes (e.g., for your gaming team,
              stream, channel, merchandise).
            </p>
            <p>
              You acknowledge that the AI models used to generate logos are complex, and while we strive for uniqueness,
              similar design elements may appear in logos generated for different users.
            </p>
            <p>
              You are responsible for ensuring that your use of any Generated Content (especially if it incorporates specific names,
              symbols, or elements from your prompts) does not infringe upon the trademark, copyright, or other intellectual property rights of third parties.
              We make no representations or warranties regarding the non-infringement of Generated Content. It is your responsibility to conduct due diligence,
              including trademark searches, if you intend to use a logo for commercial branding purposes.
            </p>
            <p>
              The underlying AI models, the Website, and all software and content provided by the Company (excluding your prompts and the specific Generated Content you create)
              are the property of the Company or its licensors and are protected by copyright and other intellectual property laws.
            </p>


            <h2>6. Prohibited Conduct</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>Generate content that is illegal, harmful, defamatory, obscene, infringing, or hateful.</li>
              <li>Attempt to reverse-engineer, decompile, or otherwise discover the source code of the AI models or the Service.</li>
              <li>Overload or disrupt the Service or its servers.</li>
              <li>Use automated scripts to scrape content or generate logos in a manner that abuses the system.</li>
              <li>Violate any applicable local, state, national, or international law.</li>
            </ul>

            <h2>7. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to the Service and your account, without prior notice or liability,
              for any reason, including but not limited to a breach of these Terms. Upon termination, your right to use the Service will cease immediately.
            </p>

            <h2>8. Disclaimers and Limitation of Liability</h2>
            <p>
              THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, REGARDING THE
              OPERATION OR AVAILABILITY OF THE SERVICE, OR THE ACCURACY, RELIABILITY, OR COMPLETENESS OF ANY CONTENT OR GENERATED LOGOS.
            </p>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THE COMPANY, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES (INCLUDING, WITHOUT LIMITATION, LOSS OF PROFITS, DATA,
              USE, GOODWILL, OR OTHER INTANGIBLE LOSSES) RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE OR
              ANY GENERATED CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT
              WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.
            </p>
            <p>
              OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE USE OF OR ANY INABILITY TO USE ANY PORTION OF THE SERVICE
              OR OTHERWISE ARISING OUT OF OR RELATING TO THESE TERMS, WHETHER IN CONTRACT, TORT, OR OTHERWISE, IS LIMITED TO THE AMOUNT YOU HAVE PAID
              US FOR CREDITS IN THE SIX (6) MONTHS PRIOR TO THE EVENT GIVING RISE TO THE LIABILITY.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the United Kingdom, without regard to its conflict of law provisions.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material, We will make
              reasonable efforts to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be
              determined at Our sole discretion.
            </p>
            <p>
              By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms.
              If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, You can contact us:
            </p>
            <ul>
              <li>
                By email:{" "}
                <a href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
              </li>
            </ul>
          </article>
        </div>
      </main>
    </>
  );
};

export default TermsOfServicePage;