/**
 * Firebase Configuration & Authorized User Credentials
 */
export const firebaseConfig = {
  apiKey: "AIzaSyB_-d0-mlHb4iOIUO2qB91WZcf8rADP2tk",
  authDomain: "ppttowebagent-analytics.firebaseapp.com",
  projectId: "ppttowebagent-analytics",
  storageBucket: "ppttowebagent-analytics.firebasestorage.app",
  messagingSenderId: "845437628234",
  appId: "1:845437628234:web:71038b8e545de032165bb3"
};

export const AUTHORIZED_EMAILS = [
  "danielptagg@googlemail.com",
  "danielptagg@gmail.com"
];

export function isAuthorizedUserEmail(email) {
  if (!email || typeof email !== "string") return false;
  const normalized = email.trim().toLowerCase();
  return AUTHORIZED_EMAILS.some((auth) => auth.toLowerCase() === normalized);
}
