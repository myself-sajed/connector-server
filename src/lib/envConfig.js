import dotenv from 'dotenv'
dotenv.config()

const config = {
    PORT: process.env.PORT || 3000,
    FRONTEND_URL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    DOMAIN: process.env.DOMAIN,
}



export default config