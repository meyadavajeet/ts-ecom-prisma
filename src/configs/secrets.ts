
import dotenv from 'dotenv';

dotenv.config({path: '.env'});

export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION! || '1h';
export const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION! || '1h';


