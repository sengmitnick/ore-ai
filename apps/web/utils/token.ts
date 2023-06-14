import Cookies from "js-cookie";
import { storage } from "./storage";

export const TOKEN = "ore-ai_token";
export const Token = {
  get TOKEN() {
    return TOKEN;
  },
  get token() {
    return storage.getItem(TOKEN);
  },
  set(token: string) {
    storage.setItem(TOKEN, token);
    this.update();
  },
  update() {
    if (this.token)
      Cookies.set(TOKEN, this.token, {
        expires: 30,
        secure: true,
        sameSite: "Lax",
      });
  },
  remove() {
    if (typeof window === "undefined") return;
    if (window.self !== window.top) return;
    if (!window.navigator.cookieEnabled) return;
    Cookies.remove(TOKEN);
    return storage.removeItem(TOKEN);
  },
  get isSignIn() {
    return !!this.token;
  },
} as const;
