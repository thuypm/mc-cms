import dotenv from "dotenv";
dotenv.config();

export const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID;
export const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET;
export const MICROSOFT_OAUTH2_URL = process.env.MICROSOFT_OAUTH2_URL;
export const APP_PORT = Number(process.env.APP_PORT);
export const MICROSOFT_REDIRECT_URI = process.env.MICROSOFT_REDIRECT_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
