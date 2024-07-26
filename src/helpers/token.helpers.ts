import jwt, { JwtPayload } from "jsonwebtoken";
import { IncomingHttpHeaders } from "http";

/**
 * Find and decrypt user details from the authorization token from headers
 *
 * @param headers - Express header object
 * @returns A JSON response decrypted user details
 */
export const parseToken: (headers: IncomingHttpHeaders) => { [key: string]: string  | null} = (headers) => {
    try {
        return verifyTokenFromHeader(getToken(headers))?.data || null
    } catch (err: any) {
        console.log("Error while parsing token : ", err.message)
        return null
    }
}

/**
 * Retrieve authorization token from Request headers
 *
 * @param headers - Express header object
 * @returns A token of type string
 */
export const getToken = (headers: IncomingHttpHeaders): string => {
    const authHeader = headers.authorization;
    return authHeader ? authHeader.replace('Bearer ', '') : '';
};

/**
 * Verification of JWT token
 *
 * @param token - string
 * @returns A decrypted user details from token
 */
export function verifyTokenFromHeader(token: string): JwtPayload {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch (err: any) {
        console.error("Failed to verify token:", err.message)
        throw new Error(JSON.stringify({ message: err.message }))
    }
}

