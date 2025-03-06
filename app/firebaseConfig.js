import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyALCayWzmpQk8lRiyW9odmz_BgY_YYBAG0",
    authDomain: "easydocv1.firebaseapp.com",
    projectId: "easydocv1",
    storageBucket: "easydocv1.appspot.com",
    messagingSenderId: "828314197342",
    appId: "1:828314197342:web:5e9d720b9c2615ce2943cf",
    measurementId: "G-FQQDXNF9JT"
};


// ป้องกันการ initialize ซ้ำซ้อนในกรณีที่มีการเรียกหลายครั้ง
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// สร้าง instance ของ Firestore
const db = getFirestore(app);

// สร้าง instance ของ Storage
const storage = getStorage(app);

export { db,storage };

