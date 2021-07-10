// server.js
import jsonServer from 'json-server';
import { NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { authRouter } from './routes';
import { CustomError, errorHandler } from './utils/errors';
import { isAuthorized } from './auth';

type ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

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

// Use json-server's middleware for both mounted
// servers. cors() here is set up with minimal settings.
// I wish I knew how to do this more precisely, but
// since I have these servers proxied, I have CORS
// superpowers.

server.use(middlewares);
server.use(cors());
server.use(jsonServer.bodyParser);

// Add creation time info
// @ts-ignore
server.use((req: Request, _res: Response, next) => {
  if (req.method === 'POST') {
    // @ts-ignore
    req.body.createdAt = Date.now();
  }
  next();
});

//
// Since json-server runs as a sub-component, there's no direct way
// to inject authorization into those routes. The next handler is how
// to do it indirectly. isAuthorized finds the URLs that require
// authorization, pulls down the JWT token data from the headers, and
// returns false if the token is not present over the required routes.
// So we are already 401'd even before json-server gets to see the URLs.
//

// @ts-ignore
server.use((req: Request, res: Response, next: NextFunction) => {
  if (isAuthorized(req)) {
    next(); // continue to JSON Server router
  } else {
    throw new CustomError('Authorizaton Required', 401);
  }
});

// Mount our sub-routers.
server.use('/auth', authRouter);
server.use('/api', router);

// Universal route to deal with 404s. Note this needs to be *before* the
// call to errorHandler.
server.all('*', async (req, res, next) => {
  throw new CustomError('Not Found', 404);
});

// Error handler: Last in the chain.
// Try and normalize any errors.
// @see https://expressjs.com/en/guide/error-haandling.html

// @ts-ignore
server.use(errorHandler);

server.listen(3005, () => {
  console.log('JSON Server is running at :3005');
});
