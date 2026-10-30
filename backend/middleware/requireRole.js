// Usage: router.post('/', requireLogin, requireRole('organization'), createOpportunity)
import HttpError from '../utils/HttpError.js';

export default function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(new HttpError(403, 'Only ' + role + 's can do this'));
    }
    next();
  };
}
