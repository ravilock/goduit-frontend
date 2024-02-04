import { error } from "@sveltejs/kit"

const statusNotFound = 404;

/*
 * @type {import('./$types').PageLoad}
 */
export async function load({ fetch, params }): void {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/profile/${params.username}`,
  );
  const data = await response.json()
  if (!response.ok) {
    if (response.status === statusNotFound) return error(statusNotFound, `Profile ${params.username} Not Found`)
    return error(response.status, data.message)
  }
  return data
}
