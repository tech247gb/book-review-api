import BookReviews from "../schemas/BookReview";
import { SearchQuery } from "../types/contoller.types";

/**
 * Make search query condition based on Request data.
 *
 * @param searchKey - search value
 * @param userId - userId
 * @returns A JSON of prepared query
 */
export const makeSearchQuery = (searchKey: string, userId?: string | null): SearchQuery => {
    let searchQuery: SearchQuery = {}
    if (userId) {
        searchQuery = { ...searchQuery, createdBy: userId }
    }

    if (searchKey) {
        searchQuery = {
            ...searchQuery,
            $or: [
                { title: new RegExp(searchKey, 'i') },
                { author: new RegExp(searchKey, 'i') }
            ]
        };
    }
    return searchQuery
}

/**
 * Retrieve data from database with search Query
 *
 * @param searchQuery - Query for database
 * @param limit - pagination limit
 * @param offset - Skip index for pagination

 * @returns An  Array of fetched data from database. 
 */
export const getReviews = async (searchQuery: SearchQuery, limit: number, offset: number) => {
    try {
        const results = await BookReviews.aggregate([
            { $match: searchQuery },
            {
                $facet: {
                    total: [{ $count: "count" }],
                    reviews: [
                        { $sort: { createdAt: -1 } },
                        { $skip: offset },
                        { $limit: limit },
                    ]
                }
            }
        ]);
        const total: number = results[0]?.total[0]?.count || 0;
        const reviews = results[0]?.reviews || [];
        return { total, reviews }
    } catch (err: any) {
        console.log("Error occured when getting reviews :", err.message)
        throw new Error(err.message)
    }
}

