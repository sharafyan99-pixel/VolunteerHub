// An error with an HTTP status code, for example: throw new HttpError(400, 'Email is required')
export default class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
