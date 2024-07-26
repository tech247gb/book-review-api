import mongoose from "mongoose"

/**
 * Preperation of string into mongoose ObjectId format
 *
 * @param id - string for convertion
 * @returns A Mongoose objectId format
 */
export const makeObjectId = (id: string | null) => {
    if(!id) return null
    return new mongoose.Types.ObjectId(id)
}