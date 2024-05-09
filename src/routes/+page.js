import { getToken } from '$lib/auth';
import { error } from "@sveltejs/kit";

export const ssr = false

/** @type {import('./$types').PageLoad} */
export async function load() {
  const [articles] = await Promise.all([loadArticles()]);
  return {
    article: articles,
  }
}

async function loadArticles() {
  const token = getToken();
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/articles`,
    { headers },
  );
  const data = await response.json();
  if (!response.ok) {
    // @ts-expect-error Dont know the type yet
    error(response.status, data.message);
  }
  return data.articles
}
