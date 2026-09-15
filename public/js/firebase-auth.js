/**
 * Firebase Authentication Integration with Google Sign-In
 * Strictly restricted to authorized email: danielptagg@googlemail.com
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { firebaseConfig, isAuthorizedUserEmail } from "./firebase-config.js";

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

let currentAuthUser = null;

export function getCurrentAuthUser() {
  return currentAuthUser;
}

export function isUserAuthorized() {
  return currentAuthUser && isAuthorizedUserEmail(currentAuthUser.email);
}

export async function loginWithGoogle() {
  const noticeEl = document.getElementById("authNotice");
  if (noticeEl) {
    noticeEl.classList.add("hidden");
    noticeEl.textContent = "";
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (!isAuthorizedUserEmail(user.email)) {
      if (noticeEl) {
        noticeEl.textContent = `Access denied: "${user.email}" is not authorized. Please sign in with danielptagg@googlemail.com.`;
        noticeEl.className = "auth-notice error";
        noticeEl.classList.remove("hidden");
      }
      await signOut(auth);
      currentAuthUser = null;
      updateAuthUI(null);
      return { success: false, error: "Unauthorized email account" };
    }

    currentAuthUser = user;
    updateAuthUI(user);
    closeAuthModal();
    return { success: true, user };
  } catch (error) {
    console.warn("[Firebase Auth] Sign in error:", error);
    if (noticeEl && error.code !== "auth/popup-closed-by-user") {
      noticeEl.textContent = error.message || "Failed to sign in with Google.";
      noticeEl.className = "auth-notice error";
      noticeEl.classList.remove("hidden");
    }
    return { success: false, error };
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    currentAuthUser = null;
    updateAuthUI(null);
    return { success: true };
  } catch (error) {
    console.warn("[Firebase Auth] Sign out error:", error);
    return { success: false, error };
  }
}

export function openAuthModal(noticeMessage = null) {
  const modal = document.getElementById("authGateModal");
  const noticeEl = document.getElementById("authNotice");
  if (modal) {
    modal.classList.remove("hidden");
  }
  if (noticeEl) {
    if (noticeMessage) {
      noticeEl.textContent = noticeMessage;
      noticeEl.className = "auth-notice warning";
      noticeEl.classList.remove("hidden");
    } else {
      noticeEl.classList.add("hidden");
    }
  }
}

export function closeAuthModal() {
  const modal = document.getElementById("authGateModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function updateAuthUI(user) {
  const signInBtn = document.getElementById("googleSignInBtn");
  const profileChip = document.getElementById("userProfileChip");
  const avatarImg = document.getElementById("userAvatar");
  const emailLabel = document.getElementById("userEmailLabel");

  if (user && isAuthorizedUserEmail(user.email)) {
    if (signInBtn) signInBtn.classList.add("hidden");
    if (profileChip) profileChip.classList.remove("hidden");
    if (avatarImg) {
      if (user.photoURL) {
        avatarImg.src = user.photoURL;
        avatarImg.classList.remove("hidden");
      } else {
        avatarImg.classList.add("hidden");
      }
    }
    if (emailLabel) {
      emailLabel.textContent = user.displayName || user.email;
      emailLabel.title = `Signed in as ${user.email}`;
    }
  } else {
    if (signInBtn) signInBtn.classList.remove("hidden");
    if (profileChip) profileChip.classList.add("hidden");
  }

  window.dispatchEvent(new CustomEvent("firebase-auth-changed", {
    detail: { user, isAuthorized: isAuthorizedUserEmail(user?.email) }
  }));
}

// Listen for auth state transitions
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (isAuthorizedUserEmail(user.email)) {
      currentAuthUser = user;
      updateAuthUI(user);
      closeAuthModal();
      console.log(`[Firebase Auth] Authorized user signed in: ${user.email}`);
    } else {
      console.warn(`[Firebase Auth] Unauthorized user rejected: ${user.email}`);
      signOut(auth).catch(() => {});
      currentAuthUser = null;
      updateAuthUI(null);
      openAuthModal(`Access restricted. Account ${user.email} is not authorized.`);
    }
  } else {
    currentAuthUser = null;
    updateAuthUI(null);
    console.log("[Firebase Auth] No user currently signed in.");
  }
});

// Bind UI buttons
export function initAuthBindings() {
  const signInBtn = document.getElementById("googleSignInBtn");
  const modalSignInBtn = document.getElementById("authModalGoogleSignInBtn");
  const signOutBtn = document.getElementById("userSignOutBtn");
  const authModal = document.getElementById("authGateModal");
  const closeAuthBtn = document.getElementById("closeAuthGateModalBtn");

  signInBtn?.addEventListener("click", () => {
    openAuthModal();
  });

  modalSignInBtn?.addEventListener("click", () => {
    loginWithGoogle();
  });

  signOutBtn?.addEventListener("click", () => {
    logoutUser();
  });

  closeAuthBtn?.addEventListener("click", () => {
    closeAuthModal();
  });

  authModal?.addEventListener("click", (e) => {
    if (e.target === authModal) {
      closeAuthModal();
    }
  });
}
