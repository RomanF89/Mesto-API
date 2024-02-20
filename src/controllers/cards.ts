import Card from "../models/Card";
import { Request, Response } from 'express';
import { RequestWithId } from '../routes/index';
import { serverError, successStatus, badRequestError, notFoundError, successCreatedStatus} from "../constants/constants";

export const getCards = (_req: Request, res: Response) => {
  Card.find({})
    .then((cards) => {
      res.status(successStatus).send(cards);
    })
    .catch(() => {
      res.status(serverError).send({ message: 'Server error' });
    });
};

export const createCard = (req: RequestWithId, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user && req?.user._id;

  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(successCreatedStatus).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        return res.status(badRequestError).send({ message: `${fields} are not correct` });
      }
      return res.status(serverError).send({ message: 'Id is not correct' });
    });
};

export const deleteCard = (req: RequestWithId, res: Response) => {
  const { cardId } = req.params;
  const user = req.user && req?.user._id;

  Card.findOne({ _id: cardId })
    .then((card): object => {
      if (!card) {
        return res.status(notFoundError).send({ message: 'Card is not correct' });
      }
      if ((card.owner).toString() === user) {
        return Card.findByIdAndDelete(cardId)
          .then((currentCard) => {
            res.status(successStatus).send({ message: `${currentCard?.name} deleted` });
          });
      }
      return res.status(serverError).send({ message: 'You are not card owner' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequestError).send({ message: 'Card id is not correct' });
      }
      return res.status(serverError).send({ message: 'Server error' });
    });
};

export const likeCard = (req: RequestWithId, res: Response) => {
  const user = req.user && req?.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: user } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(notFoundError).send({ message: 'Card is not correct' });
      }
      return res.status(successStatus).send({ message: `${card.name} liked` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequestError).send({ message: 'Card id is not correct' });
      }
      return res.status(serverError).send({ message: 'Server error' });
    });
};

export const dislikeCard = (req: RequestWithId, res: Response) => {
  const user = req.user && req?.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: user } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(notFoundError).send({ message: 'Card is not correct' });
      }
      return res.status(successStatus).send({ message: `${card.name} disliked` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequestError).send({ message: 'Card id is not correct' });
      }
      return res.status(serverError).send({ message: 'Server error' });
    });
};