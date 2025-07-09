import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Unauthorized' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(401).json({ message: 'User not found' });

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('Auth middleware error:', err);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

export default authMiddleware;
