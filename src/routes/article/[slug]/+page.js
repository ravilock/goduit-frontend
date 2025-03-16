import { error } from "@sveltejs/kit";

const statusNotFound = 404;

export const ssr = false

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const slug = params.slug
  const [article, comments] = await Promise.all([loadArticle(slug), loadComments(slug)]);
  return {
    article,
    comments,
  }
}

/**
 * @param {string} slug
 */
async function loadArticle(slug) {
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

/**
 * @param {string} slug
 */
async function loadComments(slug) {
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
