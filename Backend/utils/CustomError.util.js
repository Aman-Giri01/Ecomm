class CustomError extends Error {
  constructor(statusCode, message) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default CustomError;

// class CustomError extends Error {
//     constructor(statusCode, message) {
//         super(message);            // the correct way
//         this.statusCode = statusCode;
//         Error.captureStackTrace(this, this.constructor);
//     }
// }

// export default CustomError;
