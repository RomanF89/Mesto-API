import { NextFunction, Request, Response } from 'express';
import Card from '../models/Card';
import {
  successStatus,
  successCreatedStatus,
} from '../constants/constants';
import BadRequestError from '../errors/badRequestError';
import NotFoundError from '../errors/notFoundError';
import ForbiddenError from '../errors/forbiddenError';

export interface RequestWithId extends Request {
  user?: {
    _id: string
  }
}

export const getCards = (_req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => {
      res.status(successStatus).send(cards);
    })
    .catch((err) => {
      return next(err);
    });
};

export const createCard = (req: RequestWithId, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user && req?.user._id;

  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(successCreatedStatus).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        return next(new BadRequestError(`${fields} are not correct`));
      }
      return next(err);
    });
};

export const deleteCard = (req: RequestWithId, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const user = req.user && req?.user._id;

  Card.findOne({ _id: cardId })
    .then((card): object | void => {
      if (!card) {
        return next(new NotFoundError('Card is not correct'));
      }
      if ((card.owner).toString() === user) {
        return Card.findByIdAndDelete(cardId)
          .then((currentCard) => {
            res.status(successStatus).send({ message: `${currentCard?.name} deleted` });
          });
      }
      return next(new ForbiddenError('You are not card owner'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Card id is not correct'));
      }
      return next(err);
    });
};

export const likeCard = (req: RequestWithId, res: Response, next: NextFunction) => {
  const user = req.user && req?.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: user } }, { new: true })
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Card is not correct'));
      }
      return res.status(successStatus).send({ message: `${card.name} liked` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Card id is not correct'));
      }
      return next(err);
    });
};

export const dislikeCard = (req: RequestWithId, res: Response, next: NextFunction) => {
  const user = req.user && req?.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: user } }, { new: true })
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Card is not correct'));
      }
      return res.status(successStatus).send({ message: `${card.name} disliked` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Card id is not correct'));
      }
      return next(err);
    });
};
