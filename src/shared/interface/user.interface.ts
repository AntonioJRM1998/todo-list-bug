import { UUID } from 'crypto';

export interface IAuthResponse {
    id: UUID; // User ID
    username: string; // User name
    email: string; // User email
    iat: number; // Issued at time
    exp: number; // Token expiration time in seconds
}
