import { get, writable, type Writable } from "svelte/store";
import { isAuthenticated, logOut } from "$lib/auth";
import { error } from "@sveltejs/kit";
import { httpStatus } from "$lib/constants";

export type Comment = {
  author: {
    username: string;
    image: string;
  };
  id: string;
  createdAt: string;
  updatedAt?: string;
  body: string;
}

export const commentsStore: Writable<Comment[]> = writable();
export const subscribeComments = commentsStore.subscribe;
export const setComments = commentsStore.set;

export async function loadComments(slug: string): Promise<Comment[]> {
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
    if (response.status === httpStatus.notFound)
      error(404, `Article ${slug} Not Found`);
    if (response.status === httpStatus.unauthorized) await logOut();
    // @ts-expect-error Dont know the type yet
    error(response.status, data.message);
  }
  return data.comments;
}

export async function deleteComment(articleSlug: string, commentId: string): Promise<void> {
  if (!isAuthenticated()) {
    await logOut();
    return;
  }
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/articles/${articleSlug}/comments/${commentId}`,
    {
      credentials: "include",
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    },
  );
  if (!response.ok) {
    if (response.status === httpStatus.notFound)
      return error(404, `Article ${articleSlug} Not Found`);
    if (response.status === httpStatus.unauthorized) await logOut();
    // @ts-expect-error Dont know the type yet
    return error(response.status, data.message);
  }
  const comments = get(commentsStore);
  setComments(comments.filter((comment) => comment.id !== commentId));
}

export async function writeComment(articleSlug: string, commentBody: string): Promise<void> {
  if (!commentBody) return;
  if (!isAuthenticated()) {
    await logOut();
    return;
  }
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/articles/${articleSlug}/comments`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        comment: {
          body: commentBody,
        },
      }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    if (response.status === httpStatus.notFound)
      return error(404, `Article ${articleSlug} Not Found`);
    if (response.status === httpStatus.unauthorized) await logOut();
    // @ts-expect-error Dont know the type yet
    return error(response.status, data.message);
  }
  const comments = get(commentsStore) || [];
  setComments([...comments, data.comment]);
}
