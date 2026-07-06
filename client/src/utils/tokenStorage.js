// utils/tokenStorage.js
// Abstracts where the auth token/user live: localStorage when "Remember Me"
// was checked (persists across browser restarts), sessionStorage otherwise
// (cleared when the tab closes). Everything else in the app just calls
// these functions and doesn't need to know which storage is in use.

import { STORAGE_KEYS } from './constants';

const getStore = (remember) => (remember ? localStorage : sessionStorage);

// Look in both stores since we don't know which one was used at login time.
const findToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN) || sessionStorage.getItem(STORAGE_KEYS.TOKEN);
};

const findUser = () => {
  const raw =
    localStorage.getItem(STORAGE_KEYS.USER) || sessionStorage.getItem(STORAGE_KEYS.USER);
  return raw ? JSON.parse(raw) : null;
};

const saveSession = ({ token, user, remember }) => {
  const store = getStore(remember);
  store.setItem(STORAGE_KEYS.TOKEN, token);
  store.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.USER);
};

export const tokenStorage = { findToken, findUser, saveSession, clearSession };
