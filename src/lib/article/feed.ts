import { error } from "@sveltejs/kit";

const statusNotFound = 404;

export type FeedOption = 'global' | 'personal';

export async function feedArticles(offset: number) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/articles/feed?offset=${offset}`,
    {
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      credentials: 'include',
    },
  );
  const data = await response.json();
  if (!response.ok) {
    if (response.status == statusNotFound) return [];
    // @ts-expect-error Dont know the type yet
    error(response.status, data.message);
  }
  return data.articles
}
