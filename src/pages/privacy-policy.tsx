// src/pages/privacy-policy.tsx (for GamingLogoAI)
import Head from "next/head";
import Link from "next/link"; // Import Link if you add internal links

const PrivacyPolicyPage: React.FC = () => {
  const siteName = "Gaming Logo AI";
  const siteUrl = "https://gaminglogoai.com"; // Replace with actual live domain
  const contactEmail = "support@gaminglogoai.com"; // Replace with actual support email
  const companyName = "HDN STUDIO LTD"; // Assuming this remains the same
  const companyAddress = "71-75 Shelton Street, Covent Garden, London, WC2H 9JQ";

  // Get current year for "Last updated"
  const currentYear = new Date().getFullYear();
  // You might want a more specific last updated date if the policy changes often.
  // For now, let's use a static one or just the year.
  const lastUpdatedDate = `January 1, ${currentYear}`; // Or more specific like "May 15, 2024"

  return (
    <>
      <Head>
        <title>Privacy Policy - {siteName}</title>
        <meta
          name="description"
          content={`Read our Privacy Policy at ${siteName} to understand how we collect, use, and protect your personal data when you use our AI gaming logo generator.`}
        />
        <meta name="keywords" content="privacy policy, data protection, gaming logo ai privacy, user data, gdpr, ccpa" />
        <link rel="canonical" href={`${siteUrl}/privacy-policy`} />
        <link rel="icon" href="/favicon.ico" /> {/* Standard favicon name */}
      </Head>
      {/* Main background: dark slate, text: light slate/white */}
      <main className="flex min-h-screen flex-col items-center py-16 sm:py-24 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
        <div className="w-full max-w-3xl px-4 sm:px-6">
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Last updated: <strong>{lastUpdatedDate}</strong>
            </p>
          </header>

          {/* Tailwind CSS Typography plugin handles prose styling.
              We add dark mode prose styles.
              Links within prose will use brand accent colors.
          */}
          <article className="prose prose-lg lg:prose-xl dark:prose-invert mx-auto 
                              prose-headings:text-slate-800 dark:prose-headings:text-white 
                              prose-a:text-purple-600 dark:prose-a:text-cyan-400 hover:prose-a:underline
                              prose-strong:text-slate-700 dark:prose-strong:text-slate-100">
            <p>
              This <strong>Privacy Policy</strong> describes Our policies and procedures on the
              collection, use, and disclosure of Your information when You use the Service ({siteName}) and
              tells You about Your privacy rights and how the law protects You.
            </p>
            <p>
              We use Your Personal Data to provide and improve the Service. By using the Service,
              You agree to the collection and use of information in accordance with this Privacy
              Policy.
            </p>

            <h2>Interpretation and Definitions</h2>
            
            <h3>Interpretation</h3>
            <p>
              The words with the initial letter capitalized have meanings defined under the
              following conditions. The following definitions shall have the same meaning
              regardless of whether they appear in singular or plural.
            </p>

            <h3>Definitions</h3>
            <p>For the purposes of this Privacy Policy:</p>
            <ul>
              <li>
                <strong>Account</strong> means a unique account created for You to access our Service or
                parts of our Service.
              </li>
              <li>
                <strong>Affiliate</strong> means an entity that controls, is controlled by, or is under
                common control with a party, where &quot;control&quot; means ownership of 50% or more of the
                shares, equity interest, or other securities entitled to vote for election of
                directors or other managing authority.
              </li>
              <li>
                <strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot;, or
                &quot;Our&quot; in this Agreement) refers to {companyName}, {companyAddress}.
              </li>
              <li>
                <strong>Cookies</strong> are small files that are placed on Your computer, mobile device, or
                any other device by a website, containing the details of Your browsing history on
                that website among its many uses.
              </li>
              <li>
                <strong>Country</strong> refers to: United Kingdom.
              </li>
              <li>
                <strong>Device</strong> means any device that can access the Service such as a
                computer, a cellphone or a digital tablet.
              </li>
              <li>
                <strong>Personal Data</strong> is any information that relates to an identified or
                identifiable individual.
              </li>
              <li>
                <strong>Service</strong> refers to the Website.
              </li>
              <li>
                <strong>Service Provider</strong> means any natural or legal person who processes the
                data on behalf of the Company. It refers to third-party companies or
                individuals employed by the Company to facilitate the Service, to provide the
                Service on behalf of the Company, to perform services related to the
                Service or to assist the Company in analyzing how the Service is used.
              </li>
              <li>
                <strong>Usage Data</strong> refers to data collected automatically, either generated by
                the use of the Service or from the Service infrastructure itself (for
                example, the duration of a page visit).
              </li>
              <li>
                <strong>Website</strong> refers to {siteName}, accessible from{" "}
                <a href={siteUrl} target="_blank" rel="noopener noreferrer">
                  {siteUrl}
                </a>.
              </li>
              <li>
                <strong>You</strong> means the individual accessing or using the Service, or the company,
                or other legal entity on behalf of which such individual is accessing or using the
                Service, as applicable.
              </li>
            </ul>

            <h2>Collecting and Using Your Personal Data</h2>
            
            <h3>Types of Data Collected</h3>
            
            <h4>Personal Data</h4>
            <p>
              While using Our Service, We may ask You to provide Us with certain personally
              identifiable information that can be used to contact or identify You. Personally
              identifiable information may include, but is not limited to:
            </p>
            <ul>
              <li>Email address</li>
              <li>First name and last name (if provided during account creation or profile update)</li>
              <li>Payment information (processed by our payment processors, not stored by us directly)</li>
              <li>Prompts you enter for logo generation</li>
              <li>Generated logos associated with your account</li>
              <li>Usage Data</li>
            </ul>

            <h4>Usage Data</h4>
            <p>
              Usage Data is collected automatically when using the Service.
            </p>
            <p>
              Usage Data may include information such as Your Device&apos;s Internet Protocol address (e.g. IP address),
              browser type, browser version, the pages of our Service that You visit, the time and date of Your visit,
              the time spent on those pages, unique device identifiers and other diagnostic data.
            </p>
            <p>
              When You access the Service by or through a mobile device, We may collect certain information
              automatically, including, but not limited to, the type of mobile device You use, Your mobile device
              unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile
              Internet browser You use, unique device identifiers and other diagnostic data.
            </p>
            <p>
              We may also collect information that Your browser sends whenever You visit our Service or when You
              access the Service by or through a mobile device.
            </p>

            <h4>Tracking Technologies and Cookies</h4>
            <p>
              We use Cookies and similar tracking technologies to track the activity on Our Service and store certain
              information. Tracking technologies used are beacons, tags, and scripts to collect and track information
              and to improve and analyze Our Service. The technologies We use may include:
            </p>
            <ul>
                <li><strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service. Unless you have adjusted Your browser setting so that it will refuse Cookies, our Service may use Cookies.</li>
                <li><strong>Web Beacons.</strong> Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).</li>
            </ul>
            <p>
              Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser.
              You can learn more about cookies on <a href="https://www.privacypolicies.com/blog/cookies/" target="_blank" rel="noopener noreferrer">Privacy Policies website</a> article.
            </p>
            {/* You would list specific cookie purposes here if applicable */}

            <h2>Use of Your Personal Data</h2>
            <p>The Company may use Personal Data for the following purposes:</p>
            <ul>
              <li><strong>To provide and maintain our Service,</strong> including to monitor the usage of our Service.</li>
              <li><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</li>
              <li><strong>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
              <li><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application&apos;s push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</li>
              <li><strong>To provide You</strong> with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.</li>
              <li><strong>To manage Your requests:</strong> To attend and manage Your requests to Us.</li>
              <li><strong>For business transfers:</strong> We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.</li>
              <li><strong>For other purposes:</strong> We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.</li>
            </ul>
            {/* Add sections on Sharing, Retention, Transfer, Deletion of Your Personal Data, Security, Children's Privacy, Links to Other Websites etc. as legally required */}

            <h2>Changes to this Privacy Policy</h2>
            <p>
              We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
            </p>
            <p>
              We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the &quot;Last updated&quot; date at the top of this Privacy Policy.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, You can contact us:
            </p>
            <ul>
              <li>
                By email:{" "}
                <a href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
              </li>
              {/* Add other contact methods if available */}
            </ul>
          </article>
        </div>
      </main>
    </>
  );
};

export default PrivacyPolicyPage;