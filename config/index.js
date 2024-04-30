import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path,{ dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: path.resolve(__dirname, '../.env') });


export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;
export const NOTIFICATION_PASSWORD = process.env.NOTIFICATION_PASSWORD;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
export const REDIS_URL = process.env.REDIS_URL;
export const REDIS_EXPIRATION_TIME = process.env.REDIS_EXPIRATION_TIME;
export const REDIS_TOKEN = process.env.REDIS_TOKEN;