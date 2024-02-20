import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import usersRouter from './users';
import cardsRouter from './cards';
import { notFoundError } from '../constants/constants';

export interface RequestWithId extends Request {
  user?: {
    _id: string
  }
}

const router = Router();

router.use((req: RequestWithId, _res: Response, next: NextFunction) => {
  req.user = {
    _id: '65d1230a570347b90ea76f32'
  };
  next();
});

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req, res) => {
  res.status(notFoundError).send({ message: "Sorry can't find that!" });
});

export default router;