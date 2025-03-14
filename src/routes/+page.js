import { getToken } from '$lib/auth';
import { error } from "@sveltejs/kit";

export const ssr = false

const listArticlesPageLimit = 20;

/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
  const page = Number(url.searchParams.get("page") || 1) - 1;
  const offset = page * listArticlesPageLimit;
  const [articles] = await Promise.all([loadArticles(offset)]);
  return {
    articles: articles,
  }
}

/**
 * @param {number} offset
 */
async function loadArticles(offset) {
  const token = getToken();
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/articles?offset=${offset}`,
    { headers },
  );
  const data = await response.json();
  if (!response.ok) {
    // @ts-expect-error Dont know the type yet
    error(response.status, data.message);
  }
  return data.articles
}
