// server.js
import jsonServer from 'json-server';
import { ErrorRequestHandler, NextFunction } from 'express';
import cors from 'cors';
import { authRouter } from './routes';

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
    console.log('full err', err);
    // @ts-ignore
    res.status(400).send(err.message);
  }
});

server.listen(3005, () => {
  console.log('JSON Server is running');
});
