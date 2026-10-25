import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface BlogAuthor {
  name: string;
  role: string;
  avatar?: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: BlogAuthor;
  category: string;
  tags: string[];
  readTime: string;
  featured?: boolean;
  coverGradient?: string;
  coverImage?: string;
  content: string;
  htmlContent?: string;
  tableOfContents?: TocItem[];
}

export interface BlogCategory {
  name: string;
  count: number;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Retrieves all published blog posts sorted by date (newest first).
 */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData: BlogPost[] = fileNames
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || "Sem título",
        description: data.description || "",
        date: data.date || new Date().toISOString().split("T")[0],
        author: data.author || {
          name: "Equipe Peguei o Texto",
          role: "Especialistas em IA & Conteúdo",
        },
        category: data.category || "Geral",
        tags: Array.isArray(data.tags) ? data.tags : [],
        readTime: data.readTime || "5 min de leitura",
        featured: Boolean(data.featured),
        coverGradient: data.coverGradient || "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
        coverImage: data.coverImage,
        content,
      };
    });

  return allPostsData.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

/**
 * Retrieves a single blog post by slug, compiling markdown to HTML and extracting TOC.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const fullPathMd = path.join(postsDirectory, `${slug}.md`);
  const fullPathMdx = path.join(postsDirectory, `${slug}.mdx`);

  let targetPath = "";
  if (fs.existsSync(fullPathMd)) {
    targetPath = fullPathMd;
  } else if (fs.existsSync(fullPathMdx)) {
    targetPath = fullPathMdx;
  } else {
    return null;
  }

  const fileContents = fs.readFileSync(targetPath, "utf8");
  const { data, content } = matter(fileContents);

  // Extract Table of Contents from h2 and h3
  const toc: TocItem[] = [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    // Strip markdown formatting if any
    const plainText = rawText.replace(/[*_`]/g, "");
    const id = slugify(plainText);
    toc.push({ id, text: plainText, level });
  }

  // Configure custom renderer to inject IDs into headers
  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const plainText = text.replace(/<[^>]+>/g, "");
    const id = slugify(plainText);
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  };

  const htmlContent = await marked.parse(content, { renderer, async: true });

  return {
    slug,
    title: data.title || "Sem título",
    description: data.description || "",
    date: data.date || new Date().toISOString().split("T")[0],
    author: data.author || {
      name: "Equipe Peguei o Texto",
      role: "Especialistas em IA & Conteúdo",
    },
    category: data.category || "Geral",
    tags: Array.isArray(data.tags) ? data.tags : [],
    readTime: data.readTime || "5 min de leitura",
    featured: Boolean(data.featured),
    coverGradient: data.coverGradient || "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
    coverImage: data.coverImage,
    content,
    htmlContent,
    tableOfContents: toc,
  };
}

/**
 * Returns featured posts, falling back to latest if none marked featured.
 */
export function getFeaturedPosts(limit = 1): BlogPost[] {
  const posts = getAllPosts();
  const featured = posts.filter((p) => p.featured);
  if (featured.length > 0) {
    return featured.slice(0, limit);
  }
  return posts.slice(0, limit);
}

/**
 * Returns related posts based on matching category or tags.
 */
export function getRelatedPosts(currentSlug: string, category: string, limit = 3): BlogPost[] {
  const posts = getAllPosts();
  return posts
    .filter((p) => p.slug !== currentSlug && (p.category === category || p.tags.some((t) => category.includes(t))))
    .slice(0, limit);
}

/**
 * Returns all distinct categories with counts.
 */
export function getAllCategories(): BlogCategory[] {
  const posts = getAllPosts();
  const map = new Map<string, number>();

  posts.forEach((post) => {
    const cat = post.category || "Geral";
    map.set(cat, (map.get(cat) || 0) + 1);
  });

  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}
