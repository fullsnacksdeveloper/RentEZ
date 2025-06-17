import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' }); //update here to errorhandler
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            user_id: decoded.user_id,
            role: decoded.role
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};


export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const user = req.user; // should be set by an auth middleware
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions'
      });
    }
    next();
  };
};

// Allow only if the user owns the resource or is admin
export const allowSelfOrAdmin = (paramKey = 'id') => {
  return (req, res, next) => {
    const user = req.user;
    const targetId = parseInt(req.params[paramKey]);

    if (user.role === 'admin' || user.user_id === targetId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied: not owner or admin'
    });
  };
};

