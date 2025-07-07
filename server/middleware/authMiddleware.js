
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) return res.status(401).json({ message: 'Unauthorized: User not found' });

      // Check if user has one of the allowed roles
      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden: You do not have access' });
      }

      req.user = user; // Pass user to next middleware/route
      next();
    } catch (err) {
      console.error('JWT error:', err);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

export default authMiddleware;