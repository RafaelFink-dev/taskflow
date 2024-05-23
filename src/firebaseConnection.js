import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAFFCAtu6ct9lfDI9cZc_b2wrdoprDLOE8",
    authDomain: "reactjs-firebase-mk.firebaseapp.com",
    projectId: "reactjs-firebase-mk",
    storageBucket: "reactjs-firebase-mk.appspot.com",
    messagingSenderId: "294155828597",
    appId: "1:294155828597:web:b63ff29095f2487cb9a73c"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  export { db, auth };