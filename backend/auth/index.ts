import { NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { UserType } from '../types';
import { CustomError } from '../utils/errors';
import { getTokenData, validateToken } from '../utils/tokens';

// Check the header for token data and validate it.
const parseRequestToken = (req: Request) => {
  // @ts-ignore
  const { authorization } = req.headers;
  let token = '';
  let credentials: string | object = '';
  let data: JwtPayload | null | string = null;
  let error: any = null;
  if (authorization) {
    const match = (authorization as string).match(/^Bearer\s(\S+)/);
    if (match) {
      token = match[1];
      data = getTokenData(token);
      console.log(data);
      try {
        // @ts-ignore
        credentials = validateToken(token);
        console.log('credentials', credentials);
        // @ts-ignore
        req.currentUser = credentials;
      } catch (err) {
        error = err;
        console.log('message', err.message);
        console.log('throw custom');
      }
    }
  } else {
    console.log('no auth info');
  }

  return {
    token,
    credentials,
    error
  };
};

export const getUserTypeFromCredentials = (credentials: {
  [key: string]: string | number;
}) => {
  const user: UserType = {
    id: credentials.id as string,
    name: credentials.name as string,
    email: credentials.email as string,
    password: '', // unused
    role: credentials.role as string
  };
  return user;
};

export const validateAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (isAuthorized(req)) {
    next(); // continue to JSON Server router
  } else {
    throw new CustomError('Authorizaton Required', 401);
  }
};

// Runs after validateAuth is called early in the request.
export const validateTokenAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req).includes('currentUser')) {
    // for now, just having credentials is enough.
    next();
  } else {
    throw new CustomError('Authorizaton Required', 401);
  }
};

// Authorization code for json-server routes.
export const isAuthorized = (req: Request) => {
  const { token, credentials, error } = parseRequestToken(req);
  if (error) {
    throw new CustomError('Session expired', 401);
  }

  // @todo may want to return the string since expiry is one
  // thing we'd learn.
  if (req.method === 'GET' && req.url === '/api/requests') {
    if (token === '' || typeof credentials !== 'object') {
      if (token) {
        const message = credentials.toString();
        throw new CustomError(message, 401);
      }
      return false;
    } else {
      // We want to restrict coach requests to the particular coach.
      // @ts-ignore
      req.query.coachId = credentials.id;
      return true;
    }
  } else if (req.method === 'POST' && req.url === '/api/coaches') {
    if (token === '' || typeof credentials !== 'object') {
      return false;
    }
  }
  return true;
};
