import { getCollection } from 'astro:content';

export async function getProducts() {
  const products = await getCollection('products');
  return products.sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedProducts() {
  const products = await getProducts();
  return products.filter(p => p.data.featured);
}

export async function getArticles() {
  const articles = await getCollection('articles');
  return articles.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}
