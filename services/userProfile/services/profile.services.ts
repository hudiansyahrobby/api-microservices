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
    const { data } = await axios.post(
        `${process.env.SERVICE_AUTH}/api/v1/auth/check-auth`,
        {},
        {
            headers: {
                authorization: token,
            },
        },
    );

    const uid = data.data.uid;
    return uid;
};

export const searchUserProfile = async (newProfile: UserProfile) => {};
