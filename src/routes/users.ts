import { Router } from 'express';
import { getUser, getUsers, createUser, upadateProfile, updateAvatar } from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', upadateProfile);
router.patch('/me/avatar', updateAvatar);

export default router;