import jwt  from "jsonwebtoken";
import { envConfig } from "./env.js";

export const generateToken = (user) => { 
    const expiresIn = Math.floor(Date.now() / 1000) + (60 * 60 * 24);
    const token = jwt.sign({ ...user, exp: expiresIn }, envConfig.JWT_KEY, { algorithm: 'HS256' });
    return token
}

export const verifyToken = (token) => { 
    try {
        const decoded = jwt.verify(token, envConfig.JWT_KEY);
        return decoded;
    } catch (error) {
        return null;
    }
}
