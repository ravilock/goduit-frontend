import { error } from "@sveltejs/kit"

const listArticlesPageLimit = 20;

const statusNotFound = 404;

/*
 * @type {import('./$types').PageLoad}
 */
export async function load({ params }): Promise<{ profile: any; articles: any; }> {
  // TODO: Talvez passar fetch para dentro das funções de load
  const [profile, articles] = await Promise.all([loadProfileData(params.username), loadUserArticles(params.username)])
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

async function loadUserArticles(author: string, page = 1): Promise<any> {
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
