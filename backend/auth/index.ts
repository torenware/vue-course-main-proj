import { JwtPayload } from 'jsonwebtoken';
import { CustomError } from '../utils/Errors';
import { getTokenData, validateToken } from '../utils/Tokens';

export const isAuthorized = (req: Request) => {
  // @ts-ignore
  const { authorization } = req.headers;
  let token = '';
  let credentials: string | object = '';
  let data: JwtPayload | null | string = null;
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
        console.log('message', err.message);
        console.log('throw custom');
        throw new CustomError('Session expired', 401);
      }
    }
  } else {
    console.log('no auth info');
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
