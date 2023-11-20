import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCrErRv_97GlwTtGKu9ikRZTSd2n4f6KKY",
  authDomain: "pagina-colegio-cf110.firebaseapp.com",
  projectId: "pagina-colegio-cf110",
  storageBucket: "pagina-colegio-cf110.appspot.com",
  messagingSenderId: "358328836810",
  appId: "1:358328836810:web:31562c668932e348a0ca33",
  measurementId: "G-2CZTXP3XTD"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app); // Exporta auth
 