import { Router } from 'express';

import {
    registerFirebase,
    loginFirebase,
    loginGoogle,
    registerUsername,
    loginUsername,
    logout,
    loginFacebook,
    revokeRefreshToken,
    checkAuth,
    getUser,
    findUser,
} from '../controllers/auth.controller';
import isValid from '../middlewares/isValid';
import AuthValidation from '../validations/auth.validation';

const router = Router();

router.post('/auth/firebase-register', isValid(AuthValidation.registerFirebase, 'body'), registerFirebase);

router.post('/auth/firebase-login', isValid(AuthValidation.loginFirebase, 'body'), loginFirebase);

router.post('/auth/username-register', isValid(AuthValidation.registerUsername, 'body'), registerUsername);

router.post('/auth/username-login', isValid(AuthValidation.loginUsername, 'body'), loginUsername);

router.post('/auth/facebook-login', loginFacebook);

router.post('/auth/google-login', loginGoogle);

router.post('/auth/refresh-token', revokeRefreshToken);

router.post('/auth/logout', logout);

router.post('/auth/check-auth', checkAuth);

router.get('/auth/user/:uid', getUser);

router.post('/auth/user/search/:keyword', findUser);

export default router;
