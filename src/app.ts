import express, { NextFunction } from 'express';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards'

const { PORT = 3000 } = process.env;

export interface RequestWithId extends Request {
    user?: {
      _id: string
    }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: RequestWithId, _res: Response, next: NextFunction) => {
  req.user = {
    _id: '65d1230a570347b90ea76f32'
  };
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})