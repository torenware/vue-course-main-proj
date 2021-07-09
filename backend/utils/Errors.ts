import { ErrorRequestHandler, NextFunction } from 'express';

export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // When extending a built-in class, muck with the prototype.
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export function errorHandler(
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('entering error handler');
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
}
