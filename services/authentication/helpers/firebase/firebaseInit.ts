import admin from 'firebase-admin';
import firebase from 'firebase';
import serviceAccount from './credential.json';
import { config as dotenv } from 'dotenv';
import { config } from './firebase-config';

dotenv();

const firebaseInit = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
        databaseURL: process.env.FIREBASE_DB_URL,
    });

    firebase.initializeApp(config);
};

export default firebaseInit;
