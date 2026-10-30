// Wraps a controller so any error thrown inside it goes to the errorHandler
// (so we do not need try/catch in every controller).
export default function asyncHandler(controllerFunction) {
  return (req, res, next) => {
    Promise.resolve(controllerFunction(req, res, next)).catch(next);
  };
}
