// middleware/isAdmin.js
const isAdmin = (req, res, next) => {
  const role = req.user?.role || req.user?.userType;
  
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  next();
};

module.exports = isAdmin;
