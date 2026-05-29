export interface JwtPayload {
    id: string;
    email: string;
    role: string;
}
export declare class JwtService {
    private secret;
    constructor();
    generateAccessToken(payload: JwtPayload): string;
    generateRefreshToken(payload: JwtPayload): string;
    verifyToken(token: string): JwtPayload;
    decodeToken(token: string): JwtPayload | null;
}
