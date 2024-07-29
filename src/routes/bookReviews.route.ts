import { Router } from "express";
import { addBookReview, deleteReviewById, editBookReview, getBookReviewById, getBookReviewByUserId, viewAllBookReviews } from "../controllers/bookReview.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/get-all-reviews",viewAllBookReviews )
router.get("/get-all-reviews-by-user",verifyToken , getBookReviewByUserId )
router.get("/get-review/:id",getBookReviewById )
router.post("/add-review",verifyToken ,addBookReview )
router.put("/edit-review/:id",verifyToken, editBookReview )
router.delete("/delete-review/:id",verifyToken ,deleteReviewById )

export default router;
