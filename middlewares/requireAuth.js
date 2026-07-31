const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model.js');

const requireAuth = async (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access Denied' });
    }
    const token = authHeader.replace('Bearer ', '');

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await UserModel.findById(payload.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        req.user = user; // Attach user info to request object
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = requireAuth;