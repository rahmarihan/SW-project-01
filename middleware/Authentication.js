const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

module.exports = function authenticationMiddleware(req, res, next) {
    console.log('Inside authentication middleware'); // Log to confirm execution
    
    // Log cookies and headers for debugging
    console.log('Cookies:', req.cookies);
    console.log('Headers:', req.headers);

    if (!secretKey) {
        console.error("❗ Missing JWT_SECRET in environment variables");
        return res.status(500).json({ message: "Internal server error" });
    }

    // Extract token from cookies or Authorization header
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    console.log('Extracted Token:', token);

    if (!token) {
        console.error("❗ No token provided");
        return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
            console.error("❗ Token verification failed:", error.message);
            return res.status(403).json({ message: "Invalid token" });
        }
    
        console.log('Decoded Token:', decoded);
        req.user = decoded;  // This sets the decoded token to req.user
        next();
    });
    
    
};
