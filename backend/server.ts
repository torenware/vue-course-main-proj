// server.js
import jsonServer from 'json-server';
import { ErrorRequestHandler, NextFunction } from 'express';
import cors from 'cors';
import { authRouter } from './routes';
import { validateToken } from './utils/Tokens';

const server = jsonServer.create();
const rundir = '.';
const router = jsonServer.router(rundir + '/db.json');

// App related items.
import dotenv from 'dotenv';
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
  if (authorization) {
    const match = (authorization as string).match(/^Bearer\s(\S+)/);
    if (match) {
      token = match[1];
      // @ts-ignore
      credentials = validateToken(token);
      // @ts-ignore
      req.currentUser = credentials;
    }
  } else {
    console.log('no auth info');
  }

  // @todo may want to return the string since expiry is one
  // thing we'd learn.
  if (req.method === 'GET' && req.url === '/api/requests') {
    if (token === '' || typeof credentials !== 'object') {
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
    // @ts-ignore
    res.status(401).send('Authorization Required');
  }
});

server.use('/auth', authRouter);
server.use('/api', router);

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
    // @ts-ignore
    res.status(400).send(err.message);
  }
});

server.listen(3005, () => {
  console.log('JSON Server is running at :3005');
});
