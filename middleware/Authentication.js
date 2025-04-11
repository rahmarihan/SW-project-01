const ErrorResponse = require('../utils/errorResponse');

// Part C.1 - Protect routes (JWT check)
exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new ErrorResponse('Not authorized', 401);
    
    // Verify token (replace with your JWT logic)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    next(err);
  }
};

// Part C.2 - Role-based access (Organizer/Admin)
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ErrorResponse(`Role ${req.user.role} unauthorized`, 403));
  }
  next();
};
