import { writable, type Writable } from "svelte/store"
import { goto } from "$app/navigation";

const statusConflict = 409;

export type UserResponse = {
  user: {
    username: string;
    email: string;
    bio?: string;
    image?: string;
  }
}

function isUserResponse(data: unknown): data is UserResponse {
  if (!data) return false
  if (!(data as UserResponse)?.user) return false
  const { user } = data as UserResponse;
  return (user.username && user.email) !== ""
}

export type LogInPayload = {
  email: string;
  password: string;
}

export type SignInPayload = LogInPayload & { username: string }

const usernameStore: Writable<string> = writable()
export const subscribeUsername = usernameStore.subscribe;
export const setUsername = usernameStore.set;

const userEmailStore: Writable<string> = writable()
export const subscribeUserEmail = userEmailStore.subscribe;
export const setUserEmail = userEmailStore.set;

const userImageStore: Writable<string> = writable()
export const subscribeUserImage = userImageStore.subscribe;
export const setUserImage = userImageStore.set;

const userBioStore: Writable<string> = writable()
export const subscribeUserBio = userBioStore.subscribe;
export const setUserBio = userBioStore.set;

export async function logIn(logInPayload: LogInPayload) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/users/login`,
    {
      method: "POST",
      credentials: 'include',
      body: JSON.stringify({
        user: logInPayload
      }),
      headers: new Headers({ "Content-Type": "application/json" }),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    if (data.message) return [data.message];
    else return ["Internal Error"];
  }
  if (isUserResponse(data)) setCredentials(data);
  goto("/")
  return []
}

export async function signIn(signInPayload: SignInPayload) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/users`,
    {
      credentials: 'include',
      method: "POST",
      body: JSON.stringify({
        user: signInPayload
      }),
      headers: new Headers({ "Content-Type": "application/json" }),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    if (response.status === statusConflict) return ["Username on Email already in use"]
    if (data.message) return [data.message];
    else return ["Internal Error"];
  }
  if (isUserResponse(data)) setCredentials(data);
  goto("/")
  return []
}

function setCredentials({ user }: UserResponse): void {
  const { username, email, bio, image } = user
  sessionStorage.setItem("username", username);
  usernameStore.set(username);
  sessionStorage.setItem("userEmail", email);
  userEmailStore.set(email);
  if (bio) {
    sessionStorage.setItem("userBio", bio);
    userBioStore.set(bio);
  }
  if (image) {
    sessionStorage.setItem("userImage", image);
    userImageStore.set(image);
  }
}

export function isAuthenticated() {
  const username = sessionStorage.getItem("username")
  if (!username) return false
  const userEmail = sessionStorage.getItem("userEmail")
  if (!userEmail) return false
  const userBio = sessionStorage.getItem("userBio")
  const userImage = sessionStorage.getItem("userImage")
  if (username) usernameStore.set(username);
  if (userEmail) userEmailStore.set(userEmail);
  if (userBio) userBioStore.set(userBio);
  if (userImage) userImageStore.set(userImage);
  return true
}

export async function logOut() {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/users/logout`,
    {
      method: "POST",
      credentials: 'include',
    }
  )
  if (!response.ok) {
    return ["Internal Error"];
  }
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("userEmail");
  sessionStorage.removeItem("userImage");
  sessionStorage.removeItem("userBio");
  goto("/")
}
