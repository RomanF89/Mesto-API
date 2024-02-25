export default class ConflictingRequestError extends Error {
  statusCode: number;

  constructor(message:string | undefined) {
    super(message);
    this.statusCode = 409;
  }
}
