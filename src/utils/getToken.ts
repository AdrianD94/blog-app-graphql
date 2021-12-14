import JWT from 'jsonwebtoken';
import { JWT_SECRET } from '../keys';
export const getToken = async (token: string) => {
    try {
        return JWT.verify(token, JWT_SECRET) as {
            userId: number
        }
    } catch (error) {
        return null;
    }
}
