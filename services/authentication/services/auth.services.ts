import admin from 'firebase-admin';
import { IUser } from '../interfaces/user.interface';
import firebase from 'firebase';
import User from '../models/user.model';

export const saveUserOnDB = async (newUser: IUser) => {
    console.log(newUser);
    return User.create(newUser);
};

export const registerUser = async (newUser: IUser) => {
    const { uid } = await admin.auth().createUser(newUser);

    const userData = {
        ...newUser,
        uid,
    };

    const registeredUser = await saveUserOnDB(userData);
    return registeredUser;
};

export const registerUserWithUsername = async (newUser: IUser) => {
    const { uid } = await admin.auth().createUser(newUser);
    const { displayName, email, phoneNumber } = newUser;
    const username = email?.replace('@apikom.com', '');

    const userData = {
        username,
        displayName,
        phoneNumber,
        uid,
    };

    const registeredUser = await saveUserOnDB(userData);
    return registeredUser;
};

export const loginUser = async (email: string, password: string) => {
    const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);

    const token = await user?.getIdToken();

    return { user, token };
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

export const verifyToken = async (token: string) => {
    const { uid } = await admin.auth().verifyIdToken(token);
    return getUserByUID(uid);
};

export const getUserByUID = async (uid: string) => {
    return admin.auth().getUser(uid);
};
