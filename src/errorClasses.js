export class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ExtendableError {}
export class NotFoundError extends ExtendableError {}
