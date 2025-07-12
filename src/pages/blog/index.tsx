// src/pages/blog/index.tsx
import { type NextPage, type GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { getSortedPostsData, type PostData } from "~/lib/posts"; // Adjust path if your lib/posts.ts is elsewhere
import { format, parseISO, isValid } from 'date-fns';
import React from "react"; // Import React for JSX
import Image from "next/image";

interface BlogIndexProps {
  allPostsData: PostData[];
}

const BlogIndexPage: NextPage<BlogIndexProps> = ({ allPostsData }) => {
  const siteName = "GamingLogoAI Blog"; // Or just "GamingLogoAI"
  const siteUrl = "https://gaminglogoai.com"; // ** REPLACE with your actual production domain **

  return (
    <>
      <Head>
        <title>Blog - AI Gaming Logo Tips, Tutorials & News | {siteName}</title>
        <meta
          name="description"
          content={`Explore articles, tutorials, and insights on creating impactful AI gaming logos, PFP avatars, and effective gaming branding with ${siteName}.`}
        />
        <meta name="keywords" content="gaming logo blog, ai logo design tips, esports branding, streamer graphics, pfp avatar ideas, ai art tutorials" />
        <link rel="canonical" href={`${siteUrl}/blog`} />
        <link rel="icon" href="/favicon.ico" /> {/* Ensure this favicon exists */}
      </Head>

      <main className="container mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <header className="mb-12 sm:mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            {siteName}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Tips, tutorials, and inspiration for your ultimate gaming identity.
          </p>
        </header>

        <section>
          {allPostsData && allPostsData.length > 0 ? (
            <ul className="space-y-8 sm:space-y-10">
              {allPostsData.map(({ slug, date, title, excerpt, tags, coverImage, author }) => {
                let formattedDate = "Date not available";
                let validDateForDateTimeAttr: string | undefined = undefined;

                if (date && typeof date === 'string') {
                  try {
                    const parsedDate = parseISO(date);
                    if (isValid(parsedDate)) {
                      formattedDate = format(parsedDate, 'LLLL d, yyyy');
                      validDateForDateTimeAttr = date;
                    } else {
                      console.warn(`BlogIndex: Invalid date string for post slug "${slug}": ${date}`);
                    }
                  } catch (e) {
                    console.error(`BlogIndex: Error parsing date for post slug "${slug}" (date: "${date}"):`, e);
                  }
                } else {
                  console.warn(`BlogIndex: Missing or non-string date for post slug "${slug}".`);
                }

                const displayTitle = title || "Untitled Post";
                const displayExcerpt = excerpt || "Read more to discover...";

                return (
                  <li key={slug} className="p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <article className="flex flex-col sm:flex-row gap-6">
                      {coverImage && (
                        <div className="flex-shrink-0 w-full sm:w-1/3 md:w-1/4 aspect-video sm:aspect-square relative rounded-lg overflow-hidden">
                          <Link href={`/blog/${slug}`} legacyBehavior={false} className="block w-full h-full">
                              <Image
                                src={coverImage}
                                alt={`${displayTitle} cover image`}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-300 hover:scale-105"
                              />
                          </Link>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                          <time dateTime={validDateForDateTimeAttr}>{formattedDate}</time>
                          {author && <span className="mx-1">•</span>}
                          {author && <span>By {author}</span>}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-2 leading-tight">
                          <Link href={`/blog/${slug}`} legacyBehavior={false} className="text-purple-600 dark:text-cyan-400 hover:text-purple-700 dark:hover:text-cyan-500 hover:underline">
                              {displayTitle}
                          </Link>
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed line-clamp-3">{displayExcerpt}</p>
                        {tags && tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {tags.map(tag => (
                              <span key={tag} className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <Link href={`/blog/${slug}`} legacyBehavior={false} className="text-sm font-medium text-purple-600 dark:text-cyan-500 hover:underline inline-flex items-center group">
                            Read more <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
                        </Link>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-slate-700 dark:text-slate-300">No blog posts found yet.</p>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Check back soon for tips, tutorials, and gaming logo inspiration!</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps: GetStaticProps = async () => {
  // console.log("BlogIndex: Running getStaticProps...");
  const allPostsData = getSortedPostsData();
  // console.log("BlogIndex: Fetched posts for sitemap:", allPostsData.length);
  return {
    props: {
      allPostsData,
    },
  };
};

export default BlogIndexPage;