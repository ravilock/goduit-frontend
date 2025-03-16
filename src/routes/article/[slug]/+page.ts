import { error } from "@sveltejs/kit";
import type { PageLoadEvent } from "./$types";
import type { Article } from "$lib/article/article";
import { setComments, type Comment } from "$lib/comment/comment";

const statusNotFound = 404;

export const ssr = false

export async function load({ params }: PageLoadEvent): Promise<{ article: Article }> {
  const slug = params.slug
  const [article, comments] = await Promise.all([loadArticle(slug), loadComments(slug)]);
  setComments(comments);
  return {
    article,
  }
}

async function loadArticle(slug: string): Promise<Article> {
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/articles/${slug}`,
    {
      credentials: 'include',
      headers,
    },
  );
  const data = await response.json();
  if (!response.ok) {
    if (response.status === statusNotFound)
      error(statusNotFound, {
        message: `Article ${slug} Not Found`,
      });
    // @ts-ignore
    error(response.status, data.message);
  }
  return data.article
}

async function loadComments(slug: string): Promise<Comment[]> {
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/articles/${slug}/comments`,
    {
      credentials: 'include',
      headers,
    },
  );
  const data = await response.json();
  if (!response.ok) {
    if (response.status === statusNotFound) {
      error(statusNotFound, {
        message: `Article ${slug} Not Found`
      });
    }
    // @ts-ignore
    error(response.status, data.message);
  }
  return data.comments;
}
