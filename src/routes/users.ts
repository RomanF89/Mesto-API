import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import urlRegex from '../validation/regex';
import {
  getUser,
  getUsers,
  upadateProfile,
  updateAvatar,
  getAuthorizedUser,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);

router.get('/me', getAuthorizedUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), upadateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(urlRegex),
  }),
}), updateAvatar);

export default router;
