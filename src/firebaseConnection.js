import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCa7GsJR0Xh3cpDmA2hVbyLJBkEfq1Z97s",
    authDomain: "curso-952a4.firebaseapp.com",
    projectId: "curso-952a4",
    storageBucket: "curso-952a4.appspot.com",
    messagingSenderId: "154855798740",
    appId: "1:154855798740:web:5b7328d0112f7556ddc841",
    measurementId: "G-GZDWTJPVZB"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp)

  export { db, auth };