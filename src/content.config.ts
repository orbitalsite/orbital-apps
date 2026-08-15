import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const productSchema = z.object({
  id: z.string(),
  slug: z.string(),
  icon: z.string(),
  version: z.string(),
  releaseDate: z.date(),
  platforms: z.array(z.string()),
  architecture: z.array(z.string()),
  size: z.string(),
  free: z.boolean(),
  category: z.string(),
  downloadUrl: z.string(),
  video: z.string().optional(),
  order: z.number(),
  featured: z.boolean(),
  images: z.array(z.string()).optional(),
  translations: z.object({
    ar: z.object({
      name: z.string(),
      description: z.string(),
      longDescription: z.string(),
      features: z.array(z.string()),
      requirements: z.array(z.string()),
      changelog: z.string(),
    }),
    en: z.object({
      name: z.string(),
      description: z.string(),
      longDescription: z.string(),
      features: z.array(z.string()),
      requirements: z.array(z.string()),
      changelog: z.string(),
    }),
  }),
});

const articleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  cover: z.string(),
  author: z.string(),
  publishedAt: z.date(),
  category: z.string(),
  featured: z.boolean(),
  translations: z.object({
    ar: z.object({
      title: z.string(),
      excerpt: z.string(),
      content: z.string(),
    }),
    en: z.object({
      title: z.string(),
      excerpt: z.string(),
      content: z.string(),
    }),
  }),
});

export const collections = {
  products: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
    schema: productSchema,
  }),
  articles: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
    schema: articleSchema,
  }),
};
