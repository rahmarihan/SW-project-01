const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

module.exports = function authenticationMiddleware(req, res, next) {
    console.log('Inside authentication middleware');
    
    // Log cookies for debugging
    console.log('Cookies:', req.cookies);

    // Check if the secretKey is set in the environment variables
    if (!secretKey) {
        console.error("❗ Missing JWT_SECRET in environment variables");
        return res.status(500).json({ message: "Internal server error" });
    }

    // Extract token from cookies
    const token = req.cookies?.token; // Assuming your cookie is named 'token'

    console.log('Extracted Token:', token); // Log the extracted token

    if (!token) {
        console.error("❗ No token provided");
        return res.status(401).json({ message: "No token provided" });
    }

    // Verify token using JWT
    jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
            console.error("❗ Token verification failed:", error.message);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token expired" });
            }
            return res.status(403).json({ message: "Invalid token" });
        }

        console.log('Decoded Token:', decoded); // Log decoded token
        req.user = decoded.user;
        next();
    });
};
