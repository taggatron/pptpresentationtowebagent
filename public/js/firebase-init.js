/**
 * Firebase Bridge Initializer
 * Attaches auth and firestore services to window.FirebaseBridge
 */

import {
  auth,
  initAuthBindings,
  getCurrentAuthUser,
  isUserAuthorized,
  openAuthModal,
  closeAuthModal,
  loginWithGoogle,
  logoutUser
} from "./firebase-auth.js";

import {
  db,
  saveFirestoreSession,
  recordFirestoreSlideDwell,
  finishFirestoreSession,
  getFirestoreDeckAnalytics,
  getFirestoreAllDecksAverage,
  LESSON_PHASE_BENCHMARKS
} from "./firebase-firestore.js";

window.FirebaseBridge = {
  auth,
  db,
  getCurrentAuthUser,
  isUserAuthorized,
  openAuthModal,
  closeAuthModal,
  loginWithGoogle,
  logoutUser,
  saveFirestoreSession,
  recordFirestoreSlideDwell,
  finishFirestoreSession,
  getFirestoreDeckAnalytics,
  getFirestoreAllDecksAverage,
  LESSON_PHASE_BENCHMARKS
};

// Initialize UI event handlers on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAuthBindings);
} else {
  initAuthBindings();
}

console.log("[Firebase] Bridge initialized with Google Auth & Cloud Firestore");
