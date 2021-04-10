import { Response, Request, NextFunction } from 'express';
import { logger } from '../helpers/logger';
import { User } from '../interfaces/user.interface';
import {
    registerUser,
    loginUser,
    refreshToken,
    loginWithFacebook,
    logoutUser,
    loginWithGoogle,
} from '../services/auth.services';

export const registerFirebase = async (req: Request, res: Response) => {
    const { email, phoneNumber, password, displayName } = req.body;

    try {
        const newUser: User = {
            email,
            phoneNumber,
            displayName,
            password,
        };

        const userData = await registerUser(newUser);
        delete userData['password'];

        return res.status(201).json({ data: userData, message: 'User successfully registered', status: 201 });
    } catch (error) {
        logger.log({ level: 'error', message: error });
        if (error.code === 'auth/email-already-exists') {
            return res.status(500).json({
                message: 'Email is already used by another account',
                status: 500,
                error: {
                    message: 'Email is already used by another account',
                    type: 'email-already-existt',
                },
            });
        } else if (error.code === 'auth/phone-number-already-exists') {
            return res.status(500).json({
                message: 'Phone number is already used by another account',
                status: 500,
                error: {
                    message: 'Phone number is already used by another account',
                    type: 'phone-number-already-existt',
                },
            });
        } else {
            return res.status(500).json({
                message: 'Internal server error',
                status: 500,
                error: {
                    message: 'Internal server error',
                    type: 'server-error',
                },
            });
        }
    }
};

export const loginFirebase = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
        const user = await loginUser(email, password);

        if (!user) {
            return res.status(400).json({
                message: 'Wrong credentials',
                status: 400,
                error: {
                    message: `Email or password is wrong`,
                    type: 'wrong-credential',
                },
            });
        }

        const { token, user: userData } = user;

        return res
            .status(200)
            .json({ data: { user: userData, token }, message: 'User login successfully', status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error });
        if (error.code === 'auth/user-not-found') {
            return res.status(500).json({
                message: 'Email or password is invalid',
                status: 500,
                error: {
                    message: 'Email or password is invalid',
                    type: 'user-not-found',
                },
            });
        } else {
            return res.status(500).json({
                message: 'Internal server error',
                status: 500,
                error: {
                    message: 'Internal server error',
                    type: 'server-error',
                },
            });
        }
    }
};

export const registerUsername = async (req: Request, res: Response, next: NextFunction) => {
    const { username, phoneNumber, displayName, password } = req.body;
    const _username = username + '@apikom.com';

    try {
        const newUser: User = {
            email: _username,
            phoneNumber,
            displayName,
            password,
        };

        const userData = await registerUser(newUser);
        delete userData['password'];

        return res.status(200).json({ data: userData, message: 'User register successfully', status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error });
        if (error.code === 'auth/email-already-exists') {
            return res.status(500).json({
                message: 'Username is already used by another account',
                status: 500,
                error: {
                    message: 'Username is already used by another account',
                    type: 'email-already-existt',
                },
            });
        } else if (error.code === 'auth/phone-number-already-exists') {
            return res.status(500).json({
                message: 'Phone number is already used by another account',
                status: 500,
                error: {
                    message: 'Phone number is already used by another account',
                    type: 'phone-number-already-existt',
                },
            });
        } else {
            return res.status(500).json({
                message: 'Internal server error',
                status: 500,
                error: {
                    message: 'Internal server error',
                    type: 'server-error',
                },
            });
        }
    }
};

export const loginUsername = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    const _username = username + '@apikom.com';

    try {
        const user = await loginUser(_username, password);

        if (!user) {
            return res.status(400).json({
                message: 'Email or password is wrong',
                status: 400,
                error: {
                    message: 'Email or password is wrong',
                    type: 'wrong-credential',
                },
            });
        }

        const { token, user: userData } = user;
        return res
            .status(200)
            .json({ data: { user: userData, token }, message: 'User login successfully', status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error });
        if (error.code === 'auth/user-not-found') {
            return res.status(500).json({
                message: 'Username or password is invalid',
                status: 500,
                error: {
                    message: 'Username or password is invalid',
                    type: 'user-not-found',
                },
            });
        } else {
            return res.status(500).json({
                message: 'Internal server error',
                status: 500,
                error: {
                    message: 'Internal server error',
                    type: 'server-error',
                },
            });
        }
    }
};

export const revokeRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const { uid } = req.body;
    try {
        await refreshToken(uid);

        return res.status(200).json({ message: 'Token revoked successfully', status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error });
        if (error.code === 'auth/user-not-found') {
            return res.status(404).json({
                message: `User with id ${uid} not found`,
                status: 404,
                error: {
                    message: `User with id ${uid} not found`,
                    type: 'user-not-found',
                },
            });
        } else {
            return res.status(500).json({
                message: 'Internal server error',
                status: 500,
                error: {
                    message: 'Internal server error',
                    type: 'server-error',
                },
            });
        }
    }
};

export const loginFacebook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        const { credential, user } = await loginWithFacebook(token);

        return res.status(200).json({ data: { user, credential }, message: 'User login successfully', status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error });
        return res.status(500).json({
            message: 'Internal server error',
            status: 500,
            error: {
                message: 'Internal server error',
                type: 'server-error',
            },
        });
    }
};

export const loginGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;

        const { credential, user } = await loginWithGoogle(token);
        return res.status(200).json({ data: { user, credential }, message: 'User login successfully', status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error });
        return res.status(500).json({
            message: 'Internal server error',
            status: 500,
            error: {
                message: 'Internal server error',
                type: 'server-error',
            },
        });
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await logoutUser();
        return res.status(200).json({ message: 'User logout successfully', status: 200 });
    } catch (error) {
        logger.log({ level: 'error', message: error });
        return res.status(500).json({
            message: 'Internal server error',
            status: 500,
            error: {
                message: 'Internal server error',
                type: 'server-error',
            },
        });
    }
};
