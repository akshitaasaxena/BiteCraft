const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    // 1. Check Authorization header: Bearer <token>
    // 2. Check signed or unsigned cookies: req.cookies?.token
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            message: "Authentication required. No token provided via cookie or Bearer authorization header."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_fallback_secret_key");
        req.user = decoded;
        next();
    } catch (err) {
        const isExpired = err.name === "TokenExpiredError";
        return res.status(401).json({
            message: isExpired ? "Token has expired. Please log in again." : "Invalid authentication token."
        });
    }
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Not authenticated"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "You do not have permission to access this route"
            });
        }

        next();
    };
};

module.exports = { auth, authorizeRoles };