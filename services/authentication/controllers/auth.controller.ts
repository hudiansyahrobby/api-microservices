import { Response, Request, NextFunction } from 'express';
import AppError from '../errorHandler/AppError';
import { catchAsync } from '../errorHandler/catchAsync';
import { IUser } from '../interfaces/user.interface';
import {
    registerUser,
    loginUser,
    refreshToken,
    loginWithFacebook,
    logoutUser,
    loginWithGoogle,
    verifyToken,
    registerUserWithUsername,
} from '../services/auth.services';

export const registerFirebase = catchAsync(async (req: Request, res: Response) => {
    const { email, phoneNumber, password, displayName } = req.body;

    const newUser: IUser = {
        email,
        phoneNumber,
        displayName,
        password,
    };

    const userData = await registerUser(newUser);

    return res.status(201).json({ data: userData, message: 'User successfully registered', status: 201 });
});

export const loginFirebase = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    if (!user) {
        return next(new AppError('Email or password is wrong', 400, 'wrong-credentials'));
    }

    const { token, user: userData } = user;

    return res.status(200).json({ data: { user: userData, token }, message: 'User login successfully', status: 200 });
});

export const registerUsername = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { username, phoneNumber, displayName, password } = req.body;
    const _username = username + '@apikom.com';

    const newUser: IUser = {
        email: _username,
        phoneNumber,
        displayName,
        password,
    };

    const userData = await registerUserWithUsername(newUser);

    return res.status(201).json({ data: userData, message: 'User register successfully', status: 201 });
});

export const loginUsername = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    const _username = username + '@apikom.com';

    const user = await loginUser(_username, password);

    if (!user) {
        return next(new AppError('Email or password is wrong', 400, 'wrong-credentials'));
    }

    const { token, user: userData } = user;

    let loggedInUser;
    if (userData) {
        const userJSON: any = userData.toJSON();

        const { uid, displayName, photoURL, email, phoneNumber } = userJSON;

        loggedInUser = {
            uid,
            displayName,
            photoURL,
            email,
            phoneNumber,
        };
    }

    return res
        .status(200)
        .json({ data: { user: loggedInUser, token }, message: 'User login successfully', status: 200 });
});

export const revokeRefreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { uid } = req.body;
    await refreshToken(uid);

    return res.status(200).json({ message: 'Token revoked successfully', status: 200 });
});

export const loginFacebook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;
    const { credential, user } = await loginWithFacebook(token);

    return res.status(200).json({ data: { user, credential }, message: 'User login successfully', status: 200 });
});

export const loginGoogle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;

    const { credential, user } = await loginWithGoogle(token);
    return res.status(200).json({ data: { user, credential }, message: 'User login successfully', status: 200 });
});

export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await logoutUser();
    return res.status(200).json({ message: 'User logout successfully', status: 200 });
});

export const checkAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        return next(new AppError('Access denied, Token does not exist on headers', 403, 'forbidden'));
    }

    const accessToken: string = bearerToken.split(' ')[1];
    if (!accessToken) {
        return next(new AppError('Access denied, Token does not well formatted', 403, 'forbidden'));
    }
    const user = await verifyToken(accessToken);

    return res.status(200).json({
        message: 'Token is valid',
        status: 200,
        data: user,
    });
});
