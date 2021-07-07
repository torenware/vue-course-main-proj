import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import UserFile from '../users/UserFile';
import UserData from '../users/UserData';
import { signToken, validateToken } from '../utils/Tokens';
import Password from '../utils/Password';
import { UserType } from '../types';

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
    //throw new Error('validation failed');
    next(errors);
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
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('post hander called');
    const { email, password, name, role } = req.body;
    const store = loaderFunc();
    const withEmail = store.getUsersByField('email', email);

    if (withEmail.length > 0) {
      // Don't sign up a user twice.
      //throw new Error('Email already in use');
      const err = new Error('Duplicate email');
      res.status(400).send(err.message);
      return;
    } else {
      console.log(withEmail);
    }
    console.log('passed dupe check');

    const userData = {
      name,
      email,
      password,
      role: role ? role : 'user'
    };

    let user: UserType;
    try {
      user = await store.addUser(userData);
      store.writeToFile();
    } catch (err) {}

    // @see https://github.com/auth0/node-jsonwebtoken#token-expiration-exp-claim
    // @ts-ignore
    const userJwt = signToken(user.id!, user.email, user.role!, '2d');
    const authPayload = validateToken(userJwt);

    // And put it on as a cookie
    // req.session = {
    //   jwt: userJwt,
    // };

    // Payload imitates Google's behavior.
    // In particular: expires is a "delta".
    const payload = {
      name,
      email,
      id: user!.id,
      role: userData.role,
      token: userJwt,
      // @ts-ignore
      expires: authPayload.exp - authPayload.iat
    };

    res.status(201).send(payload);
  }
);

signup.post(
  '/signin',
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
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const store = loaderFunc();
    const withEmail = store.getUsersByField('email', email);

    if (
      withEmail.length === 0 ||
      !Password.compare((withEmail[0] as UserType).password, password)
    ) {
      const err = new Error('Invalid credentials');
      next(err);
      return;
    }
    const user = withEmail[0] as UserType;
    const { name, id, role } = user;

    // @see https://github.com/auth0/node-jsonwebtoken#token-expiration-exp-claim
    const userJwt = signToken(user.id!, user.email, user.role!, '2d');
    const authPayload = validateToken(userJwt);

    // Payload imitates Google's behavior.
    // In particular: expires is a "delta".
    const payload = {
      name,
      email,
      id,
      role,
      token: userJwt,
      // @ts-ignore
      expires: authPayload.exp - authPayload.iat
    };

    res.status(200).send(payload);
  }
);

authRouter.use(signup);

export { authRouter };
