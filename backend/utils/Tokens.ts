import jwt from 'jsonwebtoken';
import ms from 'ms';

export function validateToken(token: string) {
  const secret = process.env.JWT_KEY;
  if (!secret) {
    return false;
  }
  const payload = jwt.verify(token, secret);
  return payload;
}

export function getTokenData(token: string) {
  const payload = jwt.decode(token);
  return payload;
}

// @see https://github.com/vercel/ms
export function signToken(
  id: string,
  email: string,
  role: string,
  expiresIn: number | string = '1d'
) {
  let exp = typeof expiresIn === 'string' ? ms(expiresIn) / 1000 : expiresIn;
  exp += Math.round(Date.now() / 1000);
  const userJwt = jwt.sign(
    {
      id,
      email,
      role,
      exp
    },
    // The ! indicates that TS should allow this.
    process.env.JWT_KEY!
  );
  return userJwt;
}
