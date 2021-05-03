import { IUser, UserData, UserProfile, UserProfileData, UserResponse } from '../interfaces/profile.interface';
import Profile from '../models/profile.model';
import axios, { AxiosResponse } from 'axios';
import { config } from 'dotenv';
import AppError from '../errorHandler/AppError';

config();

export const createUserProfile = async (newProfile: UserProfile) => {
    return Profile.create(newProfile);
};

export const updateUserProfile = async (updatedProfile: UserProfile, token: string | undefined) => {
    const uid = await checkAuth(token);

    const userProfile = await getUserProfile(uid);

    if (!userProfile) {
        throw new AppError(`User Profile with uid ${uid} not found`, 404, 'not-found');
    }

    const [, _updatedUserProfile] = await Profile.update(updatedProfile, {
        where: { uid },
        returning: true,
    });

    return _updatedUserProfile[0];
};

export const getUserProfile = async (uid: string): Promise<any> => {
    const userProfile = await Profile.findOne({
        where: {
            uid,
        },
        raw: true,
    });

    if (!userProfile) {
        throw new AppError(`User Profile with uid ${uid} not found`, 404, 'not-found');
    }

    const userData = await getUserData(uid);

    const _userProfile = { ...userProfile, ...userData };

    return _userProfile;
};

export const getMyUserprofile = async (token: string | undefined): Promise<any> => {
    const uid = await checkAuth(token);
    console.log(uid);
    const userProfile = await Profile.findOne({
        where: {
            uid,
        },
        raw: true,
    });

    if (!userProfile) {
        throw new AppError('Your profile not found', 404, 'not-found');
    }

    const userData = await getUserData(uid);

    const _userProfile = { ...userProfile, ...userData };

    return _userProfile;
};

export const deleteUserProfile = async (token: string | undefined) => {
    const uid = await checkAuth(token);

    const userProfile = await getUserProfile(uid);

    if (!userProfile) {
        throw new AppError(`User Profile with uid ${uid} not found`, 404, 'not-found');
    }

    await Profile.destroy({
        where: { uid },
    });

    return userProfile;
};

export const checkAuth = async (token: string | undefined) => {
    let headersConfig = {};
    if (token) {
        headersConfig = {
            authorization: token,
        };
    }
    const response = await axios.post(
        `http://authentication:8081/api/v1/auth/check-auth`,
        {},
        {
            headers: headersConfig,
        },
    );
    console.log(response.data);
    const uid = response.data.data.uid;
    return uid;
};

export const findUserData = async (keyword: string) => {
    const user = await axios.post(`http://authentication:8081/api/v1/auth/user/search/${keyword}`);
    return user.data.data;
};

export const searchUserProfile = async (keyword: string) => {
    const users: IUser[] = await findUserData(keyword);

    const allUserProfiles: Promise<AxiosResponse<any>>[] = [];

    users.map((user) => allUserProfiles.push(getUserProfile(user.uid)));

    const allUserProfilePromises = Promise.all(allUserProfiles);
    const profiles = await allUserProfilePromises;

    const _allUserProfiles = users.map((user, index) => {
        let _user: UserData = user;
        const profile = { ..._user, ...profiles[index] };
        return profile;
    });

    let _userProfileData: UserData[] = users;
    _userProfileData = _allUserProfiles;
    return _userProfileData;
};

export const getUserData = async (uid: string) => {
    const user = await axios.get(`http://authentication:8081/api/v1/auth/user/${uid}`);
    return user.data.data;
};
