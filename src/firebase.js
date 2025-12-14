import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyASSqsyYgVys0cP5YVyT5hgIA16Fv50klI",
  authDomain: "lccia-sports-league.firebaseapp.com",
  projectId: "lccia-sports-league",
  messagingSenderId: "989531808810",
  appId: "1:989531808810:web:dcbc20f30b43fb00818f53"
};

initializeApp(firebaseConfig);

// ✅ Only Firestore is needed
export const db = getFirestore();

