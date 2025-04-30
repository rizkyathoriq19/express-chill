import { authModel } from "../model/auth.model.js";
import { userModel } from "../model/user.model.js";
import { envConfig } from "../utils/env.js";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/jwt.js";
import { renderMailHtml, sendEmail } from "../utils/mail.js";

export const authController = {
    login: async (req, res) => { 
        try {
            const { email, password } = req.body;

            const user = await authModel.findUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            } else if (user.is_actived === 0) {
                return res.status(401).json({ message: 'Email not verified' });
            }

            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            const token = generateToken({
                id: user.id,
                username: user.username,
                email: user.email,
            });

            return res.status(200).json({ message: 'Login successful', token });

        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    register: async (req, res) => {
        try {
            const { fullname, username, email, phone, password, passwordConfirmation } = req.body;

            if (!fullname || !username || !email || !phone || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            if (password !== passwordConfirmation) {
                return res.status(400).json({ message: 'Password do not match' })
            }

            const existingUsername = await authModel.findUserByUsername(username);
            if (!existingUsername) {
                return res.status(409).json({ message: 'Username already exists' });
            }
            
            const existingUser = await authModel.findUserByEmail(email);
            if (!existingUser) {
                return res.status(409).json({ message: 'Email already exists' });
            }

            const hashedPassword = await hashPassword(password);

            const newUser = await userModel.createUser({
                fullname,
                username,
                email,
                phone,  
                password: hashedPassword,
            });

            const activatedToken = generateToken({
                id: newUser.insertId,
            });

            await userModel.addToken(newUser.insertId, activatedToken);

            const contentMail = await renderMailHtml('verify-email.ejs', {
                username,
                fullname,
                email,
                created_at: new Date(),
                activationLink: `${envConfig.CLIENT_HOST}/api/verify-email?code=${activatedToken}`,
            })
            
            await sendEmail({
                from: envConfig.EMAIL_SMTP_USER,
                to: email,
                subject: 'Verify your email',
                html: contentMail,
            })

            return res.status(201).json({
                message: 'User registered successfully'
            });

        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    verifyEmail: async (req, res) => { 
        try {
            const token = req.query.code;
            if (!token) {
                return res.status(400).json({ message: 'Token is required' });
            }

            const user = await authModel.findUserByToken(token);
            if (!user) {
                return res.status(404).json({ message: 'Invalid Verification Token' });
            }

            await authModel.updateIsActived(user.id);

            return res.status(200).json({
                message: 'Email Verified Successfully'
            })

        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
