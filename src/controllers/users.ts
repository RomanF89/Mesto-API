import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { RequestWithId } from './cards';
import { successStatus, successCreatedStatus} from "../constants/constants";
import { BadRequestError } from "../errors/badRequestError";
import { NotFoundError } from "../errors/notFoundError";
import { ConflictingRequestError } from '../errors/conflictingRequestError';
import { BadAuthError } from '../errors/badAuthError';

export interface IUser {
  toObject: any;
  name: string,
  about: string,
  avatar: string,
  password?: string,
  email: string,
}

export interface IUserr {
  _id : string,
}

export interface ResponseWithId extends Response {
    _id?: string
}

 export const getUsers = (_req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => {
      res.status(successStatus).send(users);
    })
    .catch((err) => {
      next(err);
    });
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('User not found'));
      }
      return res.status(successStatus).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Id is not correct'));
      }
      next(err);
    });
};

export const getAuthorizedUser = (req: RequestWithId, res: ResponseWithId, next: NextFunction) => {
  const authorizedUser = req.user?._id;

  return User.findById(authorizedUser)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('User not found'));
      }
      const resUser: IUser | undefined = user?.toObject();
      delete resUser?.password;
      res.send(resUser);
    })
    .catch((err) => {
      next(err);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash: string) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user: IUser) => {
      const resUser = user.toObject();
      delete resUser.password;
      res.status(successCreatedStatus).send(resUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        next(new BadRequestError(`${fields} are not correct`));
      }
      if (err.code === 11000) {
        next(new ConflictingRequestError('This email already exists'));
      }
      next(err);
    });
};

export const upadateProfile = (req: RequestWithId, res: Response, next: NextFunction) => {
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
        next(new BadRequestError(`${fields} are not correct`));
      }
      next(err);
    });
  };

  export const updateAvatar = (req: RequestWithId, res: Response, next: NextFunction) => {
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
          next(new BadRequestError(`${fields} are not correct`));
        }
        next(err);
      });
    };

   export const login = (req: RequestWithId, res: ResponseWithId, next: NextFunction) => {
      const { email, password } = req.body;
      return User.findOne({ email }).select('+password')
        .then((user) => {
          if (!user) {
            throw new BadAuthError('email or password are incorrect');
          }
          return bcrypt.compare(password, user.password)
            .then((matched) => {
              if (!matched) {
                return next(new BadAuthError('email or password are incorrect'));
              }
              return user;
            });
        })
        .then((user) => {
          const token = jwt.sign({ _id: user?._id }, 'secret-key');
          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          });
          res.send({ message: 'Success' })
            .end();
        })
        .catch((err) => {
          next(err);
        });
    };

    export const unLogin = (req: RequestWithId, res: ResponseWithId, next: NextFunction) => {
      const userId = req.user?._id;
      if (!userId) {
        next(new BadRequestError('user not found'));
      }
      return User.findOne({ userId }).select('+password')
        .then((user) => {
          if (!user) {
            return next(new BadAuthError('user is incorrect'));
          }
          return user;
        })
        .then((user) => {
          const token = jwt.sign({ _id: user?._id }, 'secret-key');
          res.cookie('jwt', token, {
            maxAge: 0,
            httpOnly: true,
            sameSite: true,
          });
          res.send({ message: 'Unlogin success' })
            .end();
        })
        .catch((err) => {
          next(err);
        });
    };


