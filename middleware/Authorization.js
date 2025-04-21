module.exports = function authorizationMiddleware(...roles) {
    return (req, res, next) => {
        console.log('Inside authorization middleware');
        console.log('Roles allowed:', roles.flat()); // Flatten the roles array
        console.log('User role from req:', req.user.role); // Log the user's role

        
        // Skip authorization check specifically for GET /api/v1/events route
        // if (req.method === 'GET' && req.originalUrl === '/api/v1/events') {
        //     console.log('Skipping authorization for GET /api/v1/events route.');
        //     return next(); // Allow the request to proceed for public routes
        // }

        // If user object doesn't exist in the request, respond with unauthorized access
        if (!req.user) {
            console.error("❗ User not found in request. Token might not have been set correctly.");
            return res.status(403).json({ message: "Unauthorized access: No user found" });
        }

        // Ensure roles is a flat array and compare the role
        if (!roles.flat().includes(req.user.role.trim())) {
            console.error("❗ Unauthorized access: User does not have the correct role.");
            return res.status(403).json({ message: "Unauthorized access: Insufficient role" });
        }

        console.log('Decoded user from token:', req.user);
        next(); // Proceed to the next middleware if authorized
    };
};