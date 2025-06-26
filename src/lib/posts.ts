// src/lib/posts.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
// Optional: Add any remark/rehype plugins for MDX here if needed
// import remarkGfm from 'remark-gfm' // Example for GitHub Flavored Markdown
// import rehypeSlug from 'rehype-slug'
// import rehypeAutolinkHeadings from 'rehype-autolink-headings'

const postsDirectory = path.join(process.cwd(), 'src', 'posts') // Adjust if your posts are elsewhere

export interface PostFrontmatter {
  title: string;
  date: string;
  author?: string;
  excerpt?: string;
  tags?: string[];
  coverImage?: string;
  [key: string]: any; // For any other custom frontmatter
}

export interface PostData extends PostFrontmatter {
  slug: string;
  content?: any; // Will hold the serialized MDX source
}

export function getSortedPostsData(): PostData[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".mdx" from file name to get slug
    const slug = fileName.replace(/\.mdx$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the slug
    return {
      slug,
      ...(matterResult.data as PostFrontmatter),
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.mdx$/, ''),
      },
    }
  })
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use next-mdx-remote to convert MDX to something React can render
  const mdxSource = await serialize(matterResult.content, {
    mdxOptions: {
      // remarkPlugins: [remarkGfm], // Example
      // rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings], // Example
    },
  })

  return {
    slug,
    content: mdxSource,
    ...(matterResult.data as PostFrontmatter),
  }
}