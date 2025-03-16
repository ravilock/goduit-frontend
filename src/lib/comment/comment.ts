import { get, writable, type Writable } from "svelte/store";
import { isAuthenticated, logOut } from "$lib/auth";
import { error } from "@sveltejs/kit";

const statusNotFound = 404;

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
    if (response.status === statusNotFound)
      return error(statusNotFound, `Article ${articleSlug} Not Found`);
    // @ts-ignore
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
    if (response.status === statusNotFound)
      return error(statusNotFound, `Article ${articleSlug} Not Found`);
    // @ts-ignore
    return error(response.status, data.message);
  }
  const comments = get(commentsStore) || [];
  setComments([...comments, data.comment]);
}
