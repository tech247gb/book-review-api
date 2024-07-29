import BookReviews from "../schemas/BookReview";
import { Request, Response, SearchQuery } from "../types/contoller.types";
import { makeObjectId } from "../helpers/mongoose.helper";
import { parseToken } from "../helpers/token.helpers";
import { getReviews, makeSearchQuery } from "../helpers/bookReview.helper";

/**
 * Adds a new book review.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns A JSON response indicating success or failure
 */
export const addBookReview = async (req: Request, res: Response) => {
    try {
        const { title, author, reviewText, rating ,imageUrl } = req.body
        // Validate input fields
        if (!title || !author || !reviewText || !rating) {
            return res.status(406).send({ message: 'Missing booking review details' })
        }
        const userId = parseToken(req.headers)?._id ?? null

        const newReview = new BookReviews({ title, author, reviewText, rating, createdBy: userId ,imageUrl })

        const savedReview = await newReview.save()

        if (!savedReview) {
            return res.status(500).send({ success: false, message: 'Review not added' })
        }
        return res.status(201).send({ success: true, message: 'Review added successfully' })

    } catch (err: any) {
        console.error("Error on adding Book review:", err.message)
        res.status(500).json({ error: err.message })
    }
}
/**
 * View all book reviews
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns A JSON response indicating success or failure
 */
export const viewAllBookReviews = async (req: Request, res: Response) => {
    try {
        const limit: number = parseInt(req.query.limit as string || '5')
        const page: number = parseInt(req.query.page as string || '1')
        const offset: number = (page - 1) * limit
        const searchKey = (req.query.searchKey as string || '').trim()
        const searchQuery: SearchQuery = makeSearchQuery(searchKey)
        const { total, reviews } = await getReviews(searchQuery, limit, offset)
        return res.status(200).send({ total, reviews })
    } catch (err: any) {
        console.log("Error occured when fetching all reviews")
        return res.json({ err: err.message })
    }
}

/**
 * Edit and update a book review.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns A JSON response indicating success or failure
 */
export const editBookReview = async (req: Request, res: Response) => {
    try {
        const { updateObject } = req.body
        const { id } = req.params
        const { _id: userId } = parseToken(req.headers)


        if (!id) return res.status(402).send({ message: 'Review Id is missing' })

        const objectId = makeObjectId(id)
        const review = await BookReviews.findOne({ _id: objectId, createdBy: userId }).lean()

        if (!review) {
            return res.status(401).send({ message: "There is no review for this user." })
        }
        await BookReviews.findByIdAndUpdate({ _id: objectId }, { ...updateObject })
        return res.status(200).send({ message: "Review updated successfully" })
    } catch (err: any) {
        console.log("Error occured when updating reviews ", err.message)
        return res.json({ err: err.message })
    }
}
/**
 * Delete a book review.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns A JSON response indicating success or failure
 */
export const deleteReviewById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { _id: userId } = parseToken(req.headers)
        if (!id) return res.status(402).send({ message: 'Review Id is missing' })
        const reviewByuser = await BookReviews.findOne({ _id: makeObjectId(id), createdBy: userId })
        if (!reviewByuser) {
            return res.status(401).send({ message: `You don't have permission to delete this review id : ${id} ` })
        }
        await reviewByuser.deleteOne()
        return res.status(200).send({ message: `Successfully deleted the review with id : ${reviewByuser._id.toString()} ` })
    } catch (err: any) {
        console.log("Error on deleting a review :", err.message)
        return res.json({ err: err.message })
    }
}
/**
 * View a book review of a user.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns A JSON response indicating success or failure
 */
export const getBookReviewByUserId = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string || '5')
        const page = parseInt(req.query.page as string || '1')
        const searchKey = (req.query.searchKey as string || '').trim()

        const offset: number = (page - 1) * limit
        const { _id: userId } = parseToken(req.headers)

        const searchQuery: SearchQuery = makeSearchQuery(searchKey, userId)
        const { total, reviews } = await getReviews(searchQuery, limit, offset)
        return res.status(200).send({ total, reviews })
    } catch (err: any) {
        console.log("Error occur when fetching reviews by user :", err.message)
        return res.json({ err: err.message })
    }
}
/**
 * View a book review by book id..
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns A JSON response indicating success or failure
 */
export const getBookReviewById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        if (!id) return res.status(402).send({ message: 'Review Id is missing' })
        const review = await BookReviews.findOne({ _id: makeObjectId(id) }).lean()
        return res.status(200).send({ review: review || {} })
    } catch (err: any) {
        console.log("Error occur when feching book review by id", err.message)
        return res.json({ err: err.message })
    }
}
