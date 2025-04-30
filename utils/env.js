import { config } from 'dotenv'
config({ path: '.env.local' })

export const envConfig = {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    JWT_KEY: process.env.JWT_KEY,
    EMAIL_SMTP_HOST: process.env.EMAIL_SMTP_HOST,
    EMAIL_SMTP_PORT: process.env.EMAIL_SMTP_PORT,
    EMAIL_SMTP_USER: process.env.EMAIL_SMTP_USER,
    EMAIL_SMTP_PASS: process.env.EMAIL_SMTP_PASS,
    EMAIL_SMTP_SECURE: process.env.EMAIL_SMTP_SECURE,
    EMAIL_SMTP_SERVICE_NAME: process.env.EMAIL_SMTP_SERVICE_NAME,
    CLIENT_HOST: process.env.CLIENT_HOST,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
}