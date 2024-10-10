import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyALCayWzmpQk8lRiyW9odmz_BgY_YYBAG0",
    authDomain: "easydocv1.firebaseapp.com",
    projectId: "easydocv1",
    storageBucket: "easydocv1.appspot.com",
    messagingSenderId: "828314197342",
    appId: "1:828314197342:web:5e9d720b9c2615ce2943cf",
    measurementId: "G-FQQDXNF9JT"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };

