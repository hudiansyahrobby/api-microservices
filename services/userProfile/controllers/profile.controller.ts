import { Response, Request, NextFunction } from 'express';
import AppError from '../errorHandler/AppError';
import { catchAsync } from '../errorHandler/catchAsync';
import { IUser } from '../interfaces/profile.interface';
import {
    checkAuth,
    createUserProfile,
    deleteUserProfile,
    findUserData,
    getUserData,
    getUserProfile,
    searchUserProfile,
    updateUserProfile,
} from '../services/profile.services';

export const createProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newProfile = {
        ...req.body,
    };
    const _newProfile = await createUserProfile(newProfile);
    return res.status(201).json({ message: 'User Profile successfully created', data: _newProfile, status: 201 });
});

export const getProfileById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req.params;

    const userProfile = await getUserProfile(profileId);

    if (!userProfile) {
        return next(new AppError(`User Profile with id ${profileId} not found`, 404, 'not-found'));
    }

    const userData = await getUserData(profileId);

    const _userProfile = { ...userProfile, ...userData };

    return res.status(200).json({ message: 'OK', data: _userProfile, status: 200 });
});

export const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    const uid = await checkAuth(token);

    const userProfile = await getUserProfile(uid);

    if (!userProfile) {
        return next(new AppError(`Your profile not found`, 404, 'not-found'));
    }

    const user = await getUserData(uid);

    const _userProfile = { ...userProfile, user };
    return res.status(200).json({ message: 'OK', data: _userProfile, status: 200 });
});

export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    const uid = await checkAuth(token);
    const userProfile = await getUserProfile(uid);

    if (!userProfile) {
        return next(new AppError(`User Profile with uid ${uid} not found`, 404, 'not-found'));
    }

    const updatedProfile = { ...req.body };

    const [, _updatedUserProfile] = await updateUserProfile(uid, updatedProfile);

    return res
        .status(200)
        .json({ message: 'User profile updated successfully', data: _updatedUserProfile[0], status: 200 });
});

export const deleteProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    const uid = await checkAuth(token);

    const userProfile = await getUserProfile(uid);

    if (!userProfile) {
        return next(new AppError(`User Profile with uid ${uid} not found`, 404, 'not-found'));
    }

    await deleteUserProfile(uid);

    return res.status(200).json({ message: 'User profile deleted successfully', data: userProfile, status: 200 });
});

export const searchUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { keyword } = req.params;
    const userProfile = await searchUserProfile(keyword);
    return res.status(200).json({ message: 'OK', data: userProfile, status: 200 });
});
