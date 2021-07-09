// server.js
import jsonServer from 'json-server';
import 'express-async-errors';
import { ErrorRequestHandler, NextFunction } from 'express';
import cors from 'cors';
import { authRouter } from './routes';
import { validateToken, getTokenData } from './utils/Tokens';
import { CustomError } from './utils/Errors';

const server = jsonServer.create();
const rundir = '.';
const router = jsonServer.router(rundir + '/db.json');

// App related items.
import dotenv from 'dotenv';
import { JwtPayload } from 'jsonwebtoken';
dotenv.config({
  path: rundir + '/.env.local'
});

const middlewares = jsonServer.defaults({
  noCors: true,
  logger: true
});

server.use(middlewares);
server.use(cors());

server.use(jsonServer.bodyParser);
// @ts-ignore
server.use((req: Request, res: Response, next) => {
  if (req.method === 'POST') {
    // @ts-ignore
    req.body.createdAt = Date.now();
  }
  next();
});

const isAuthorized = (req: Request) => {
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

// @ts-ignore
server.use((req: Request, res: Response, next: NextFunction) => {
  if (isAuthorized(req)) {
    next(); // continue to JSON Server router
  } else {
    throw new CustomError('Authorizaton Required', 401);
  }
});

server.use('/auth', authRouter);
server.use('/api', router);

// Universal route to deal with 404s. Note this needs to be *before* the
// call to errorHandler.
server.all('*', async (req, res, next) => {
  throw new CustomError('Not Found', 404);
});

// Last in the chain.
// @see https://expressjs.com/en/guide/error-haandling.html

// @ts-ignore
server.use(function(
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!err) {
    console.log('no err');
    next();
  } else {
    let message: string;
    let status = 400;

    if (err instanceof CustomError) {
      message = err.message;
      status = err.statusCode;
    }
    // @ts-ignore
    else if (err.message) {
      // @ts-ignore
      message = err.message;
    } else {
      message = err.toString();
    }
    // @ts-ignore
    res.status(status).send({ error: message });
  }
});

server.listen(3005, () => {
  console.log('JSON Server is running at :3005');
});
