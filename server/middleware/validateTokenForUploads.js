const jwt = require("jsonwebtoken");
const validateTokenForUploads = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token', details: error.message });
    }
};

module.exports = validateTokenForUploads;