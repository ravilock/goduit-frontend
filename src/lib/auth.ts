import { writable, type Writable } from "svelte/store"
import { identityCookieName } from "$lib/constants";
import { goto } from "$app/navigation";

const statusConflict = 409;

export type UserResponse = {
  user: {
    username: string;
    email: string;
    token: string;
    bio?: string;
    image?: string;
  }
}

function isUserResponse(data: unknown): data is UserResponse {
  if (!data) return false
  if (!(data as UserResponse)?.user) return false
  const { user } = data as UserResponse;
  return (user.username && user.email && user.token) !== ""
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
  const { username, email, bio, image, token } = user
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
  sessionStorage.setItem("token", token);
}

export function isAuthenticated() {
  const token = getCookie(identityCookieName) || sessionStorage.getItem("token");
  const hasToken = token !== null && token.length > 0;
  if (!hasToken) return false
  const username = sessionStorage.getItem("username")
  const userEmail = sessionStorage.getItem("userEmail")
  const userBio = sessionStorage.getItem("userBio")
  const userImage = sessionStorage.getItem("userImage")
  if (username) usernameStore.set(username);
  if (userEmail) userEmailStore.set(userEmail);
  if (userBio) userBioStore.set(userBio);
  if (userImage) userImageStore.set(userImage);
  return true
}

export function logOut() {
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("userEmail");
  sessionStorage.removeItem("token")
  deleteCookie(identityCookieName);
  goto("/")
}

export function getToken() {
  return getCookie(identityCookieName) || sessionStorage.getItem("token")
}

function getCookie(cname: string): string | '' {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function deleteCookie(cname: string) {
  document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
