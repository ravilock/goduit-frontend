import { goto } from "$app/navigation";
import { isAuthenticated, logOut } from "$lib/auth";
import { isProfileResponse, type ProfileResponse } from "$lib/profile";
import { type Writable, writable } from "svelte/store";

export type ArticleResponse = {
  article: Article;
}

export type Article = {
  createdAt?: Date;
  updatedAt?: Date;
  slug: string;
  title: string;
  description: string;
  body: string;
  author: ProfileResponse;
  tagList: string[];
  favoritesCount: number;
  favorited: boolean;
}

export type WriteArticlePayload = {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

export const articleStore: Writable<Article> = writable();
export const subscribeArticle = articleStore.subscribe;
export const setArticle = articleStore.set;

function isArticleResponse(data: unknown): data is ArticleResponse {
  if (typeof data !== "object" || data === null) return false;

  const response = data as Record<string, unknown>;
  const article = response.article as Record<string, unknown> | undefined;

  if (typeof article !== "object" || article === null) return false;

  return (
    typeof article.slug === "string" &&
    typeof article.title === "string" &&
    typeof article.description === "string" &&
    typeof article.body === "string" &&
    isProfileResponse(article.author) &&
    Array.isArray(article.tagList) &&
    article.tagList.every(tag => typeof tag === "string") &&
    typeof article.favoritesCount === "number" &&
    typeof article.favorited === "boolean" &&
    (article.createdAt === undefined || article.createdAt instanceof Date || typeof article.createdAt === "string") &&
    (article.updatedAt === undefined || article.updatedAt instanceof Date || typeof article.updatedAt === "string")
  );
}

export async function listArticles(offset: number) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/articles?offset=${offset}`,
    {
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      credentials: 'include',
    },
  );
  const data = await response.json();
  if (!response.ok) {
    // @ts-expect-error Dont know the type yet
    error(response.status, data.message);
  }
  return data.articles
}

export async function writeArticle(writeArticlePayload: WriteArticlePayload) {
  if (!isAuthenticated()) {
    await logOut();
    return [];
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/articles`,
    {
      credentials: 'include',
      method: "POST",
      body: JSON.stringify({
        article: writeArticlePayload,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    if (data.message) return [data.message];
    else return ["Internal Error"];
  }
  if (isArticleResponse(data)) goto(`/article/${data.article.slug}`);
  return [];
}

export async function updateArticle(writeArticlePayload: WriteArticlePayload, slug: string) {
  if (!isAuthenticated()) {
    await logOut();
    return [];
  }
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/articles/${slug}`,
    {
      credentials: 'include',
      method: "PUT",
      body: JSON.stringify({
        article: writeArticlePayload,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    if (data.message) return [data.message];
    else return ["Internal Error"];
  }
  if (isArticleResponse(data)) goto(`/article/${data.article.slug}`);
  return [];
}

export async function deleteArticle(slug: string) {
  if (!isAuthenticated()) {
    await logOut();
    return [];
  }
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/articles/${slug}`,
    {
      credentials: 'include',
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    }
  );
  if (!response.ok) {
    return ["Internal Error"];
  }
  return [];
}
