import { Router } from 'express';
import { getCards, createCard, deleteCard, likeCard, dislikeCard  } from '../controllers/cards';
import { celebrate, Joi } from 'celebrate';
import validation from 'validator';

const router = Router();

router.post('', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value, helpers) => {
      if (validation.isURL(value)) {
        return value;
      }
      return helpers.error('any.invalid');
    }),
  }),
}), createCard);

router.get('/', getCards);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required()}),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required()}),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required()}),
}), dislikeCard);

export default router;