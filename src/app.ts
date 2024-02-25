import express from 'express';
import { errorLogger, requestLogger } from './middlewares/logger';
import mongoose from 'mongoose';
import routes from './routes/index'
import { Request, Response } from 'express';
import { serverError } from './constants/constants';
import cookieParser from 'cookie-parser';


interface IErrorHandler extends Error {
  statusCode?: number
}

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(requestLogger)

app.use(routes);

app.use(errorLogger);


app.use((err: IErrorHandler, req: Request, res: Response) => {
  const { statusCode = serverError, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === serverError
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
