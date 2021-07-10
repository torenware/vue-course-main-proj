import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import UserFile from '../users/UserFile';
import UserData from '../users/UserData';
import { signToken, validateToken } from '../utils/tokens';
import Password from '../utils/password';
import { UserType } from '../types';
import { CustomError } from '../utils/errors';

function loaderFunc() {
  const uf = new UserFile(process.cwd() + '/users.json');
  uf.createIfNotExisting();
  const store = UserData.loadFromFile(uf);
  return store;
}

// Make sure the standard validators run.
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('validate:', errors);
    next(errors);
  }
  next();
};

const buildPayload = (user: UserType) => {
  // Make sure we're passing the optional members of UserType at this point:
  if (!user.role || !user.id) {
    console.log('misconfiguration problem with user object');
    return null;
  }
  // @see https://github.com/vercel/ms for valid time constants.
  const tokenTTL = process.env.TOKEN_TTL || '2d';

  // @see https://github.com/auth0/node-jsonwebtoken#token-expiration-exp-claim
  // @ts-ignore
  const userJwt = signToken(user.id, user.email, user.role, tokenTTL);
  const authPayload = validateToken(userJwt);

  const payload = {
    name: user.name,
    email: user.email,
    id: user.id,
    role: user.role,
    token: userJwt,
    // @ts-ignore
    expires: authPayload.exp
  };

  return payload;
};

// Sub-router for /auth URI.
const signup = express.Router();

// Wraps our sub-router
const authRouter = express.Router();

authRouter.use(function(req: Request, res: Response, next: NextFunction) {
  console.log(`Processing ${req.method} ${req.url}`);
  next();
});

//
// Handlers
//

signup.get('/signup', async (req: Request, res: Response) => {
  res.status(200).send('hello from the beyond');
});

// Signup handler
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
    const { email, password, name, role } = req.body;
    const store = loaderFunc();
    const withEmail = store.getUsersByField('email', email);

    if (withEmail.length > 0) {
      // Don't sign up a user twice.
      throw new CustomError('Duplicate email', 400);
    }

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
    } catch (err) {
      throw new CustomError('Could not write user to store', 400);
    }

    const payload = buildPayload(user);
    res.status(201).send(payload);
  }
);

// Login handler.
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
      const err = new CustomError('Invalid credentials', 400);
      next(err);
      return;
    }
    const user = withEmail[0] as UserType;
    const payload = buildPayload(user);
    res.status(200).send(payload);
  }
);

authRouter.use(signup);
export { authRouter };
