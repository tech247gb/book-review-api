import { Next, Request, Response } from "../types/contoller.types";
import { getToken, verifyTokenFromHeader } from "../helpers/token.helpers";

/**
 * Middleare for token verification
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param res - Express Callback for successful verification
 * @returns-  Error response when verification fails
 */
export const verifyToken = async (req: Request, res: Response, next: Next) => {
    try {
        const token: string = getToken(req.headers)
        if (!token) return res.status(403).json({ message: "Access Denied" });
        verifyTokenFromHeader(token)
        next();
    } catch (err: any) {
        try{
            console.log(JSON.parse(err.message) );
            res.status(500).json({ err: JSON.parse(err.message)?.message });
        }catch(err:any){
            res.status(500).json({ err: err.message });
        }
    }
};
