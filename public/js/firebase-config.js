/**
 * Firebase Configuration & Authorized User Credentials
 */
export const firebaseConfig = {
  apiKey: "AIzaSyA1KCz5UdkBMRf8rY68vGR9BqCuzc68SSM",
  authDomain: "aaq-bio-arranger-2627.firebaseapp.com",
  projectId: "aaq-bio-arranger-2627",
  storageBucket: "aaq-bio-arranger-2627.firebasestorage.app",
  messagingSenderId: "79390374495",
  appId: "1:79390374495:web:f769ea498e883b9f0db9ea"
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
