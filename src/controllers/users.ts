import User from '../models/User';
import { Request, Response } from 'express';
import { RequestWithId } from '../routes/index';
import { serverError, successStatus, badRequestError, notFoundError, successCreatedStatus} from "../constants/constants";


 export const getUsers = (_req: Request, res: Response) => {
  User.find({})
    .then((users) => {
      res.status(successStatus).send(users);
    })
    .catch(() => {
      res.status(serverError).send({ message: 'Server error' });
    });
};

export const getUser = (req: Request, res: Response) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(notFoundError).send({ message: 'User not found' });
      }
      return res.status(successStatus).send(user);
    })
    .catch((err) => {
      if (err.name === '404 Not Found') {
        return res.status(badRequestError).send({ message: 'Id is not correct' });
      }
      return res.status(serverError).send({ message: 'Server error' });
    });
};


export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => {
      res.status(successCreatedStatus).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        return res.status(badRequestError).send({ message: `${fields} are not correct` });
      }
      return res.status(serverError).send({ message: 'Server error' });
    });
};

export const upadateProfile = (req: RequestWithId, res: Response) => {
  const userId = req.user && req?.user._id;
  const userName = req.body.name;
  const userAbout = req.body.about;

  return User.findByIdAndUpdate(userId, { name: userName, about: userAbout }, {
    new: true, runValidators: true,
  })
    .then((userData) => {
      res.status(successStatus).send(userData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        return res.status(badRequestError).send({ message: `${fields} are not correct` });
      }
      return res.status(serverError).send({ message: 'Server error' });
    });
  };

  export const updateAvatar = (req: RequestWithId, res: Response) => {
    const userId = req.user && req?.user._id;
    const userAvatar = req.body.avatar;

    return User.findByIdAndUpdate(userId, { avatar: userAvatar }, {
      new: true, runValidators: true,
    })
      .then((userData) => {
        res.status(successStatus).send(userData);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          const fields = Object.keys(err.errors).join(', ');
          return res.status(badRequestError).send({ message: `${fields} are not correct` });
        }
        return res.status(serverError).send({ message: 'Server error' });
      });
    };



