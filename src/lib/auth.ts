import { writable, type Writable } from "svelte/store"
import { identityCookieName } from "$lib/constants";

export const usernameStore: Writable<string> = writable()
export const userEmailStore: Writable<string> = writable()

export function isAuthenticated() {
  usernameStore.set(sessionStorage.getItem("username") ?? "");
  userEmailStore.set(sessionStorage.getItem("userEmail") ?? "");
  const token = getCookie(identityCookieName) || sessionStorage.getItem("token");
  return token !== null && token.length > 0;
}

export function logOut() {
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("userEmail");
  deleteCookie(identityCookieName);
  sessionStorage.removeItem("token")
  location.reload()
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
