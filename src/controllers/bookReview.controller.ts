import BookReviews from "../schemas/BookReview";
import { Request, Response, SearchQuery } from "../types/contoller.types";
import { makeObjectId } from "../helpers/mongoose.helper";
import { parseToken } from "../helpers/token.helpers";
import { getReviews, makeSearchQuery } from "../helpers/bookReview.helper";

/*
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
