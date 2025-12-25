export interface JwtPayload {
    id: string;
    name: string;
    iat: number;
    exp: number;
    iss: string;
}