const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            // Redirect to login page if the token is missing
            return res.redirect('http://localhost:5173/login');
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Attach the decoded user information to the request object
        req.user = decoded.user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // Handle token expiration separately
            return res.redirect('http://localhost:5173/login?error=token_expired');
            return res.status(401).json({ error: 'Token expired' });
        }

        // Redirect to login page for other token validation errors
        res.redirect('http://localhost:5173/login?error=invalid_token');
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = validateToken;
