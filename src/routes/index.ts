import { Router, RequestHandler } from 'express';
import { celebrate, Joi } from 'celebrate';
import usersRouter from './users';
import cardsRouter from './cards';
import { createUser, login, unLogin } from '../controllers/users';
import { auth } from '../middlewares/auth';
import NotFoundError from '../errors/notFoundError';
import urlRegex from '../validation/regex';

const router = Router();

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlRegex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth as unknown as RequestHandler);

router.post('/signout', unLogin);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Sorry can't find that!"));
});

export default router;
