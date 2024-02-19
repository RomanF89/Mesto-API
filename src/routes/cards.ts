import { Router } from 'express';
import { getCards, createCard, deleteCard, likeCard, dislikeCard  } from '../controllers/cards';

const router = Router();

router.post('', createCard);
router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;