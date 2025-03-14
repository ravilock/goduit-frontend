import { goto } from "$app/navigation";
import { getToken, logOut } from "./auth";
import { isProfileResponse, type ProfileResponse } from "./profile";

export type ArticleResponse = {
  article: {
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
}

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

export type WriteArticlePayload = {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}
export async function writeArticle(writeArticlePayload: WriteArticlePayload) {
  const token = getToken();
  if (!token) {
    logOut();
    return [];
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/articles`,
    {
      method: "POST",
      body: JSON.stringify({
        article: writeArticlePayload,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    if (data.message) return [data.message];
    else return ["Internal Error"];
  }
  console.log(data, isArticleResponse(data));
  if (isArticleResponse(data)) goto(`/article/${data.article.slug}`);
  return [];
}
