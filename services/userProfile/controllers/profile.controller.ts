import { Response, Request } from 'express';
import { logger } from '../helpers/logger';
import {
    checkAuth,
    createUserProfile,
    deleteUserProfile,
    getUserProfile,
    updateUserProfile,
} from '../services/profile.services';

export const createProfile = async (req: Request, res: Response) => {
    try {
        const uid = await checkAuth(req.headers.authorization);

        const userProfile = await getUserProfile(uid);

        if (userProfile) {
            return res.status(400).json({
                message: 'User Profile has already exist',
                status: 400,
                error: {
                    message: `User Profile with uid ${uid} is already exist`,
                    type: 'Bad Request',
                },
            });
        }

        const newProfile = {
            uid,
            ...req.body,
        };
        const _newProfile = await createUserProfile(newProfile);
        return res.status(201).json({ message: 'User Profile successfully created', data: _newProfile, status: 201 });
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getProfileById = async (req: Request, res: Response) => {
    const { profileId } = req.params;

    try {
        const userProfile = await getUserProfile(profileId);

        if (!userProfile) {
            return res.status(404).json({
                message: 'Not Found',
                status: 404,
                error: {
                    message: `User Profile with id ${profileId} not found`,
                    type: 'Not Found',
                },
            });
        }

        return res.status(200).json({ message: 'OK', data: userProfile, status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getMyProfile = async (req: Request, res: Response) => {
    try {
        const uid = await checkAuth(req.headers.authorization);

        const userProfile = await getUserProfile(uid);

        if (!userProfile) {
            return res.status(404).json({
                message: 'Not Found',
                status: 404,
                error: {
                    message: `User Profile with id ${uid} not found`,
                    type: 'Not Found',
                },
            });
        }

        return res.status(200).json({ message: 'OK', data: userProfile, status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const uid = await checkAuth(req.headers.authorization);

        const userProfile = await getUserProfile(uid);

        if (!userProfile) {
            return res.status(404).json({
                message: 'Not Found',
                status: 404,
                error: {
                    message: `User Profile with uid ${uid} not found`,
                    type: 'Not Found',
                },
            });
        }

        const updatedProfile = { ...req.body };

        const _updatedUserProfile = await updateUserProfile(uid, updatedProfile);

        return res
            .status(200)
            .json({ message: 'User profile updated successfully', data: _updatedUserProfile, status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteProfile = async (req: Request, res: Response) => {
    try {
        const uid = await checkAuth(req.headers.authorization);

        const userProfile = await getUserProfile(uid);

        if (!userProfile) {
            return res.status(404).json({
                message: 'Not Found',
                status: 404,
                error: {
                    message: `User Profile with uid ${uid} not found`,
                    type: 'Not Found',
                },
            });
        }

        await deleteUserProfile(uid);

        return res.status(200).json({ message: 'User profile deleted successfully', data: userProfile, status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const searchUser = async (req: Request, res: Response) => {
    try {
    } catch (error) {
        logger.log({ level: 'error', message: error.message });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
