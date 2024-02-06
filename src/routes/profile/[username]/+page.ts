import { listArticlesPageLimit } from "$lib/constants";
import { error } from "@sveltejs/kit"

const statusNotFound = 404;

/*
 * @type {import('./$types').PageLoad}
 */
export async function load({ params, url }): Promise<{ profile: any; articles: any; }> {
  // TODO: Talvez passar fetch para dentro das funções de load
  const username = params.username;
  const page = url.searchParams.get("page") || 1
  const [profile, articles] = await Promise.all([loadProfileData(params.username), loadUserArticles(username, page)])
  return {
    profile,
    articles
  }
}

async function loadProfileData(username: string): Promise<any> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/profile/${username}`,
  );
  const data = await response.json()
  if (!response.ok) {
    if (response.status === statusNotFound) return error(statusNotFound, `Profile ${username} Not Found`)
    return error(response.status, data.message)
  }
  return data.profile
}

async function loadUserArticles(author: string, page: int): Promise<any> {
  console.log({ author, page })
  const offset = listArticlesPageLimit * (page - 1)
  const query = new URLSearchParams({
    author,
    limit: listArticlesPageLimit.toString(),
    offset: offset.toString()
  })
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles?${query.toString()}`);
  const data = await response.json()
  if (!response.ok) {
    if (response.status === statusNotFound) return error(statusNotFound, `Profile ${author} Not Found`)
    return error(response.status, data.message)
  }
  return data.articles
}
