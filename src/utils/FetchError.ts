export default class FetchError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // When extending a built-in class, muck with the prototype.
    Object.setPrototypeOf(this, FetchError.prototype);
  }
}
