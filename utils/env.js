import { config } from 'dotenv'
config({ path: '.env.local' })

export const envConfig = {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    JWT_KEY: process.env.JWT_KEY,
}