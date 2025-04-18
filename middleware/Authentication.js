const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

module.exports = function authenticationMiddleware(req, res, next) {
  console.log('Inside authentication middleware');
  
  // First, check if the secretKey is set in the environment variables
  if (!secretKey) {
    console.error("❗ Missing JWT_SECRET in environment variables");
    return res.status(500).json({ message: "Internal server error" });
  }

  // Get token from cookies (or fallback to headers if cookies are not available)
  const cookie = req.cookies;
  const token = cookie?.token || (req.headers.cookie?.split('=')[1]);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify token using JWT
  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      // Handle expired token separately
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Invalid token" });
    }

    // Attach decoded user info to the request object for use in subsequent middlewares or routes
    req.user = decoded.user;
    next();
  });
};
