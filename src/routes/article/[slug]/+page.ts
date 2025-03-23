import type { PageLoadEvent } from "./$types";
import { loadArticle, type Article } from "$lib/article/article";
import { setComments, loadComments } from "$lib/comment/comment";

export const ssr = false

export async function load({ params }: PageLoadEvent): Promise<{ article: Article }> {
  const slug = params.slug
  const [article, comments] = await Promise.all([loadArticle(slug), loadComments(slug)]);
  setComments(comments);
  return {
    article,
  }
}
