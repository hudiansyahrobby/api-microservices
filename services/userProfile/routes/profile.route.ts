import { Router } from 'express';
import {
    createProfile,
    deleteProfile,
    getMyProfile,
    getProfileById,
    searchUser,
    updateProfile,
} from '../controllers/profile.controller';

import isValid from '../middlewares/isValid';
import profileValidation from '../validations/profile.validation';

const router = Router();

router.post('/user-profile', isValid(profileValidation.profile, 'body'), createProfile);

router.get('/user-profile/me', getMyProfile);

router.get('/user-profile/:profileId', getProfileById);

router.put('/user-profile/me', isValid(profileValidation.profile, 'body'), updateProfile);

router.delete('/user-profile/me', deleteProfile);

router.get('/user-profile/search/:keyword', searchUser);

export default router;
