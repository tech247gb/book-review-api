import { Schema, model } from "mongoose";

const BookReviewsSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        reviewText: {
            type: String,
            required: true,
        },
        rating: {
            type: String,
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        createdAt: {
            type:Date,
            default: Date.now,
        },
        updatedAt:{
            type:Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
    }
);

const BookReviews = model("BookReviews", BookReviewsSchema);
export default BookReviews;
