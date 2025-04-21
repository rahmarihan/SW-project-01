const authorize = (allowedRoles) => {
  return (req, res, next) => {
    console.log('🛡️ Roles allowed:', allowedRoles);
    console.log('👤 User role from token:', req.user.role);

    if (!allowedRoles.includes(req.user.role)) {
      console.log('❌ Unauthorized access: Insufficient role');
      return res.status(403).json({ message: 'Unauthorized access: Insufficient role' });
    }

    next();
  };
};

module.exports = authorize;
