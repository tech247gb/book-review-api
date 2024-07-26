import User from "../schemas/User";
import { Request, Response } from "../types/contoller.types";
import { userObj } from "../types/userTypes";
import { compare, hash, sign } from "../utils/hash";


/**
 * Registration of user
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns A JSON response indicating success or failure
 */
export const signup = async (req: Request, res: Response) => {
    const { email, password, username } = req.body;
    if (email && password && username) {
        try {
            const isExist = await User.findOne({ email });

            if (isExist) {
                return res.status(409).json({ message: "Email already exist!!" });
            } else {
                const hashedPassword = await hash(password);
                const newUser = new User({ email, password: hashedPassword, username });
                const response = await newUser.save();

                if (response) {
                    console.log("User registered!");
                    return res.status(201).send({ message: "User registered!" });
                }
            }
        } catch (err: any) {
            console.log("Error:", err);
            return res.status(404).json({ err: err.message });
        }
    } else {
        return res.status(406).send({ message: 'Missing email ,password or username' });
    }
};

/**
 * Login for user
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns A JSON response of JWT token
 */

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(406).send({ message: 'Missing email or password' });
        }
        const user = await User.findOne({ email }).lean();

        if (!user) {
            console.log("User doesn't exist!");
            res.status(404).json("User doesn't exist!");
            return;
        }
        const isMatch :boolean = await compare(password, user.password);
        if (isMatch) {
            const userObj: userObj = { _id: user._id?.toString(), name: user?.username, email: user?.email }
            const token :string = sign(userObj);
            return res.status(200).json({ token });
        } else {
            return res.status(404).json("Invalid Credentails!");
        }

    } catch (err: any) {
        return res.json({ err: err.message });
    }
};
export const verifyJwtToken = (req :Request, res :Response) => {
    res.status(200).json({ isValid: true });
  };