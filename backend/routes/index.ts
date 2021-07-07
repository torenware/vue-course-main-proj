import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import UserFile from '../users/UserFile';
import UserData from '../users/UserData';

function loaderFunc() {
  console.log('enter store loader');
  const uf = new UserFile(process.cwd() + '/users.json');
  uf.createIfNotExisting();
  console.log('start loading data');
  const store = UserData.loadFromFile(uf);
  console.log('store loaded');
  return store;
}

const authRouter = express.Router();

authRouter.use(function(req: Request, res: Response, next: NextFunction) {
  console.log('my middleware called');
  next();
});

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error('validation failed');
  }
  next();
};

const signup = express.Router();

signup.get('/signup', async (req: Request, res: Response) => {
  res.status(200).send('hello from the beyond');
});

signup.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log('post hander called');
    const { email, password, name, role } = req.body;
    const store = loaderFunc();

    console.log('store', store);
    const withEmail = store.getUsersByField('email', email);

    if (withEmail.length > 0) {
      // Don't sign up a user twice.
      throw new Error('Email already in use');
    }

    const userData = {
      name,
      email,
      password,
      role: role ? role : 'user'
    };

    const user = await store.addUser(userData);
    store.writeToFile();

    // Build the token, which we will deliver as a cookie
    // since we are doing server side rendering and will not have
    // the needed js machinery to create an Authentication header.

    // Let's make expiration a week out.
    // @see https://github.com/auth0/node-jsonwebtoken#token-expiration-exp-claim
    const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        exp: expires
      },
      // The ! indicates that TS should allow this.
      process.env.JWT_KEY!
    );

    // And put it on as a cookie
    // req.session = {
    //   jwt: userJwt,
    // };

    const payload = {
      name,
      email,
      id: user.id,
      role: userData.role,
      token: userJwt,
      expires
    };

    res.status(201).send(payload);
  }
);

authRouter.use(signup);

export { authRouter };
