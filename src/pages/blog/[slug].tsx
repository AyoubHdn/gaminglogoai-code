// src/pages/blog/[slug].tsx
import { type NextPage, type GetStaticProps, type GetStaticPaths } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { format, isValid, parseISO } from 'date-fns';
import React from "react";

import { getAllPostSlugs, getPostData, type PostData } from "~/lib/posts";

// --- Define Custom Components for MDX Rendering ---
const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    // The main H1 is usually handled by the page structure outside MDX content
    // but if you use # H1 inside MDX, this would apply.
    // We'll assume the page <header> has the primary H1.
    // For MDX content, we usually start with H2.
    <h1 className="text-3xl sm:text-4xl font-extrabold mt-12 mb-6 text-slate-900 dark:text-white !leading-tight" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl sm:text-3xl font-semibold mt-10 mb-5 text-slate-800 dark:text-white !leading-snug" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl sm:text-2xl font-semibold mt-8 mb-4 text-slate-800 dark:text-white !leading-snug" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-base sm:text-lg leading-relaxed my-5 sm:my-6 text-slate-700 dark:text-slate-300" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside my-5 sm:my-6 pl-5 space-y-2 text-slate-700 dark:text-slate-300" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside my-5 sm:my-6 pl-5 space-y-2 text-slate-700 dark:text-slate-300" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-base sm:text-lg leading-relaxed mb-1.5" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (props.href && props.href.startsWith('/')) {
      return <Link href={props.href} className="text-purple-600 dark:text-cyan-400 hover:underline font-medium transition-colors">{props.children}</Link>;
    }
    return <a target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-cyan-400 hover:underline font-medium transition-colors" {...props}>{props.children}</a>;
  },
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!props.src) return null;
    return (
      <span className="block my-8 relative aspect-video shadow-lg rounded-lg overflow-hidden">
        <Image
          src={props.src}
          alt={props.alt || "Blog content image"}
          fill
          style={{ objectFit: "contain" }} // Use "contain" for blog images to see whole image
          sizes="(max-width: 768px) 100vw, 700px"
          className="rounded-lg"
        />
      </span>
    );
  },
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-6 pl-4 italic border-l-4 border-purple-500 dark:border-cyan-500 text-slate-600 dark:text-slate-400" {...props} />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-slate-200 dark:border-slate-700" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => { // For inline code `code`
    // Check if it's inside a <pre> tag (block code) or inline
    // This is a bit tricky without knowing the parent. For simplicity, basic styling.
    // For proper syntax highlighting, you'd use rehype-prism or similar.
    return <code className="px-1.5 py-0.5 text-sm bg-slate-100 dark:bg-slate-800 text-purple-700 dark:text-cyan-300 rounded font-mono" {...props} />;
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => ( // For code blocks ```code```
    <pre className="my-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto text-sm" {...props} />
  ),
  // Add any other custom components you might use in MDX:
  // MyCustomComponent: MyImportedCustomComponent,
  // KeyTakeaways: ({ children }) => <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-md">{children}</div>,
};
// --- End Custom MDX Components ---

interface BlogPostPageProps {
  postData: PostData & { content: MDXRemoteSerializeResult };
}

const BlogPostPage: NextPage<BlogPostPageProps> = ({ postData }) => {
  // ... (siteName, siteUrl, date handling, displayTitle, displayExcerpt - same as before) ...
  const siteName = "GamingLogoAI Blog";
  const siteUrl = "https://www.gaminglogoai.com"; // ** REPLACE **
  let formattedDate = "Date not available";
  let validDateForDateTimeAttr: string | undefined = undefined;
  if (postData.date && typeof postData.date === 'string') { try {
      const parsedDate = parseISO(postData.date);
      if (isValid(parsedDate)) {
        formattedDate = format(parsedDate, 'LLLL d, yyyy');
        validDateForDateTimeAttr = postData.date;
      } else { console.warn(`BlogPostPage [${postData.slug}]: Invalid date string: "${postData.date}"`); }
    } catch (e) { console.error(`BlogPostPage [${postData.slug}]: Error parsing date "${postData.date}":`, e); }
  } else { console.warn(`BlogPostPage [${postData.slug}]: Date missing/invalid.`); }
  
  const displayTitle = postData.title || "Untitled Post";
  const displayExcerpt = postData.excerpt || displayTitle;


  return (
    <>
      <Head>
        <title>{displayTitle} | {siteName}</title>
        <meta name="description" content={displayExcerpt.substring(0, 160)} />
        {postData.tags && postData.tags.length > 0 && (
          <meta name="keywords" content={postData.tags.join(', ')} />
        )}
        <link rel="canonical" href={`${siteUrl}/blog/${postData.slug}`} />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph / Facebook Meta Tags */}
        <meta property="og:title" content={displayTitle} />
        <meta property="og:description" content={displayExcerpt.substring(0, 200)} />
        {postData.coverImage && (
            <meta property="og:image" content={`${siteUrl}${postData.coverImage.startsWith('/') ? '' : '/'}${postData.coverImage}`} />
        )}
        <meta property="og:url" content={`${siteUrl}/blog/${postData.slug}`} />
        <meta property="og:type" content="article" />
        {validDateForDateTimeAttr && <meta property="article:published_time" content={new Date(validDateForDateTimeAttr).toISOString()} />}
        {postData.author && <meta property="article:author" content={postData.author} />}
        {postData.tags && postData.tags.map(tag => (
            <meta property="article:tag" content={tag} key={`og-tag-${tag}`} />
        ))}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content={postData.coverImage ? "summary_large_image" : "summary"} />
        <meta name="twitter:title" content={displayTitle} />
        <meta name="twitter:description" content={displayExcerpt.substring(0, 200)} />
        {postData.coverImage && (
            <meta name="twitter:image" content={`${siteUrl}${postData.coverImage.startsWith('/') ? '' : '/'}${postData.coverImage}`} />
        )}
        {/* Optional: <meta name="twitter:site" content="@YourGamingLogoAIHandle"> */}
        {/* Optional: <meta name="twitter:creator" content={postData.authorTwitterHandle || "@YourGamingLogoAIHandle"}> */}
      </Head>

      <main className="container mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        {/* REMOVE THE `prose` CLASSES FROM THE <article> TAG if you are fully styling with mdxComponents */}
        {/* OR, keep base prose and let mdxComponents override specific elements */}
        <article className="text-slate-700 dark:text-slate-300"> {/* Basic text color */}
          <header className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white leading-tight">
              {displayTitle}
            </h1>
            <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-x-3">
              <span>Published on <time dateTime={validDateForDateTimeAttr}>{formattedDate}</time></span>
              {postData.author && <span className="mx-1">•</span>}
              {postData.author && <span>By {postData.author}</span>}
            </div>
            {postData.coverImage && (
              <div className="mt-8 mb-4 relative aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
                <Image 
                  src={postData.coverImage} alt={`${displayTitle} cover image`} fill 
                  style={{objectFit: "cover"}} priority sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            )}
          </header>
          
          {postData.content ? (
            <MDXRemote {...postData.content} components={mdxComponents} />
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-10">Content for this post is currently unavailable.</p>
          )}

          {/* ... (Tags and Back to Blog link as before, maybe with 'not-prose' if still using base prose on article) ... */}
          {/* Tags Section */}
          {postData.tags && postData.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Tagged In:</h3>
                  <div className="flex flex-wrap gap-2">
                      {postData.tags.map(tag => (
                          // Optional: Make tags linkable to a tag archive page
                          // <Link key={tag} href={`/blog/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`} legacyBehavior={false}>
                          //   <a className="text-xs bg-purple-100 text-purple-700 dark:bg-cyan-500/20 dark:text-cyan-300 px-3 py-1.5 rounded-full font-medium hover:bg-purple-200 dark:hover:bg-cyan-500/30 transition-colors">
                          //       #{tag}
                          //   </a>
                          // </Link>
                          <span key={tag} className="text-xs bg-purple-100 text-purple-700 dark:bg-cyan-500/20 dark:text-cyan-300 px-3 py-1.5 rounded-full font-medium">
                              #{tag}
                          </span>
                      ))}
                  </div>
              </div>
          )}
          {/* Back to Blog Link */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
            <Link href="/blog" legacyBehavior={false}>
                <span className="inline-flex items-center text-purple-600 dark:text-cyan-400 hover:text-purple-700 dark:hover:text-cyan-300 font-medium cursor-pointer group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to All Blog Posts
                </span>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostSlugs(); // From lib/posts.ts
  return {
    paths,
    fallback: false, // Pages not found will 404
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.slug || typeof params.slug !== 'string') {
    return { notFound: true };
  }
  try {
    const postData = await getPostData(params.slug); // From lib/posts.ts
    return {
      props: {
        postData,
      },
    };
  } catch (error) {
    // Handle case where getPostData might throw (e.g., file not found for slug)
    console.error(`Error fetching post data for slug "${params.slug}":`, error);
    return { notFound: true };
  }
};

export default BlogPostPage;