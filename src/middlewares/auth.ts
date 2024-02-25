import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import BadAuthError from '../errors/badAuthError';

export interface RequestWithJwt extends Request {
  cookies: {
    jwt: string;
  };
  user?: string | JwtPayload
}

export const auth = (req: RequestWithJwt, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return next(new BadAuthError('Need authorization'));
  }
  req.user = payload;

  return next();
};
