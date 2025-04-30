import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = { 
    verifyToken: (req, res, next) => { 
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
    
        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Token not provided' });
    
        try {
            const user = verifyToken(token);
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
    }
}