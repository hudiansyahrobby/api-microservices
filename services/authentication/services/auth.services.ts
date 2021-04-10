import admin from 'firebase-admin';
import { User } from '../interfaces/user.interface';
import firebase from 'firebase';

export const registerUser = async (newUser: User) => {
    const db = admin.firestore();
    const docRef = db.collection('users');

    const { uid } = await admin.auth().createUser(newUser);
    await docRef.doc(uid).set({ ...newUser, uid });
    const userData = {
        ...newUser,
        uid,
    };
    return userData;
};

export const loginUser = async (email: string, password: string) => {
    const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
    const token = await user?.getIdToken();

    const db = admin.firestore();
    const userRef = db.collection('users').doc(user?.uid as string);
    const doc = await userRef.get();
    if (!doc.exists) {
        console.log('User not found');
    } else {
        return { user: doc.data(), token };
    }
};

export const refreshToken = (uid: string) => {
    return admin.auth().revokeRefreshTokens(uid);
};

export const loginWithFacebook = async (token: string) => {
    const credentialToken = firebase.auth.FacebookAuthProvider.credential(token);
    return firebase.auth().signInWithCredential(credentialToken);
};

export const loginWithGoogle = async (token: string) => {
    const credentialToken = firebase.auth.GoogleAuthProvider.credential(token);
    return firebase.auth().signInWithCredential(credentialToken);
};

export const logoutUser = async () => {
    return firebase.auth().signOut();
};
