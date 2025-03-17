import { listArticles } from "$lib/article/article";
import { feedArticles, type FeedOption } from "$lib/article/feed";
import { type LoadEvent } from "@sveltejs/kit";

export const ssr = false

const listArticlesPageLimit = 20;

export async function load({ url }: LoadEvent) {
  const page = Number(url.searchParams.get("page") || 1) - 1;
  const currentFeed: FeedOption = url.searchParams.get("currentFeed") == "personal"
    ? "personal"
    : "global";
  const offset = page * listArticlesPageLimit;
  const [articles] = await Promise.all([loadArticles(offset, currentFeed)]);
  return {
    articles: articles,
  }
}

async function loadArticles(offset: number, feedOptions: FeedOption) {
  if (feedOptions == 'personal') return feedArticles(offset);
  return listArticles(offset);
}
