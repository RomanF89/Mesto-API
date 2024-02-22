import { Router } from 'express';
import { getUser, getUsers, upadateProfile, updateAvatar, getAuthorizedUser } from '../controllers/users';
import { celebrate, Joi } from 'celebrate';
import { urlRegex } from '../validation/regex';


const router = Router();


router.get('/', getUsers);

router.get('/me', getAuthorizedUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string()}),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), upadateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(urlRegex),
  }),
}), updateAvatar);

export default router;