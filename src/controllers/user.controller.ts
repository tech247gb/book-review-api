import { makeObjectId } from "../helpers/mongoose.helper";
import { parseToken } from "../helpers/token.helpers";
import User from "../schemas/User";
import { Request, Response } from "../types/contoller.types";
import { userObj } from "../types/userTypes";
import { sign } from "../utils/hash";

/**
 * Edit and update user details
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns A JSON response indicating success or failure
 */
export const updateUserInformation = async (req: Request, res: Response) => {
    try {
        const { updateObject } = req.body
        const { _id: userId } = parseToken(req.headers)
        const isExist = await User.findOne({ email: updateObject.email, _id: { $ne: makeObjectId(userId) } });
        if (isExist) {
            return res.status(409).json({ message: "Email already exist!!" });
        }
        const userInfo = await User.findOne({ _id: makeObjectId(userId) })
        if (!userInfo) {
            return res.status(404).send({ message: "No user" })
        }
        const updatedData = await User.findByIdAndUpdate({ _id: makeObjectId(userId) }, { ...updateObject }, { new: true })
        if (!updatedData) {
            return res.status(304).send({ message: "User not updated" })
        }
        const userObj: userObj = { _id: updatedData._id?.toString(), name: updatedData?.username, email: updatedData?.email }
        const token = sign(userObj);

        return res.status(200).send({ token })

    } catch (err: any) {
        console.log("Error while updating user info :", err.message)
    }

}