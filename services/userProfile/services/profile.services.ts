import { IUser, UserData, UserProfile, UserProfileData, UserResponse } from '../interfaces/profile.interface';
import Profile from '../models/profile.model';
import axios, { AxiosResponse } from 'axios';
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

export const getUserProfile = async (uid: string): Promise<any> => {
    return Profile.findOne({
        where: {
            uid,
        },
        raw: true,
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
        `http://services_authentication_1:8081/api/v1/auth/check-auth`,
        {},
        {
            headers: headersConfig,
        },
    );
    const uid = response.data.data.uid;
    return uid;
};

export const findUserData = async (keyword: string) => {
    const user = await axios.post(`http://services_authentication_1:8081/api/v1/auth/user/search/${keyword}`);
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
    const user = await axios.get(`http://services_authentication_1:8081/api/v1/auth/user/${uid}`);
    return user.data.data;
};
