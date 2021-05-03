import { Response, Request, NextFunction } from 'express';
import { catchAsync } from '../errorHandler/catchAsync';
import {
    createUserProfile,
    deleteUserProfile,
    getMyUserprofile,
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

    return res.status(200).json({ message: 'OK', data: userProfile, status: 200 });
});

export const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    const userprofile = await getMyUserprofile(token);
    return res.status(200).json({ message: 'OK', data: userprofile, status: 200 });
});

export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    const updatedProfileData = { ...req.body };

    const updatedProfile = await updateUserProfile(updatedProfileData, token);

    return res.status(200).json({ message: 'User profile updated successfully', data: updatedProfile, status: 200 });
});

export const deleteProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    const deletedProfile = await deleteUserProfile(token);
    return res.status(200).json({ message: 'User profile deleted successfully', data: deletedProfile, status: 200 });
});

export const searchUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { keyword } = req.params;
    const userProfile = await searchUserProfile(keyword);
    return res.status(200).json({ message: 'OK', data: userProfile, status: 200 });
});
