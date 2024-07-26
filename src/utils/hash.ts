import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userObj } from "../types/userTypes";

/**
 * Hashing of password
 *
 * @param password -string
 * @returns A Promise with hashed password string
 */
export const hash : (password: string)=>Promise<string> = async (password) => {
    const salt = await bcrypt.genSalt();
    const hashedValue = await bcrypt.hash(password, salt);
    return hashedValue;
};

/**
 * Compare the existing password with user entered password
 *
 * @param value - string
 * @param compareValue - string
 * @returns A Promise with boolean of password match
 */
export const compare: (value: string, compareValue: string) => Promise<boolean> = async (value, compareValue) => {
    const isMatch: boolean = await bcrypt.compare(value, compareValue);
    return isMatch;
};

/**
 * Prepration of JWT token
 *
 * @param data - Object of token payload
 * @param compareValue - string
 * @returns A string of signed token
 */
export const sign: (data: userObj) => string = (data) => {
    const token: string = jwt.sign({ data }, process.env.JWT_SECRET as string, { expiresIn: '5h' });
    return token;
};
