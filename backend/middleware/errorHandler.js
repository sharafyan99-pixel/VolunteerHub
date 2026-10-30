// Every error ends up here and is sent back as { "error": "message" }
export default function errorHandler(error, req, res, next) {
  let statusCode = error.statusCode || 500;
  let message = error.message;

  if (error.name === 'CastError') {            // a wrong id format
    statusCode = 404;
    message = 'Not found';
  }
  if (error.name === 'ValidationError') {      // a field does not match the model
    statusCode = 400;
  }
  if (statusCode === 500) {
    console.log(error);
  }
  res.status(statusCode).json({ error: message });
}
