import admin from 'firebase-admin';
import { UserProfile } from '../interfaces/profile.interface';
import firebase from 'firebase';
import Profile from '../models/profile.model';
import axios from 'axios';
import { config } from 'dotenv';

config();

export const createUserProfile = async (newProfile: UserProfile) => {
    return Profile.create(newProfile);
};

export const updateUserProfile = async (uid: string, updatedProfile: UserProfile) => {
    return Profile.update(updatedProfile, {
        where: { uid },
        returning: true,
    });
};

export const getUserProfile = async (uid: string) => {
    return Profile.findOne({
        where: {
            uid,
        },
    });
};

export const deleteUserProfile = async (uid: string) => {
    return Profile.destroy({
        where: { uid },
    });
};

export const checkAuth = async (token: string | undefined) => {
    let headersConfig = {};
    if (token) {
        headersConfig = {
            authorization: token,
        };
    }
    const response = await axios.post(
        `http://172.25.0.5:8081/api/v1/auth/check-auth`,
        {},
        {
            headers: headersConfig,
        },
    );
    const uid = response.data.data.uid;
    return uid;
};

export const searchUserProfile = async (newProfile: UserProfile) => {};
