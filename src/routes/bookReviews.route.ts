import { Router } from "express";
import { getBookReviewById, viewAllBookReviews } from "../controllers/bookReview.controller";

const router = Router();

router.get("/get-all-reviews",viewAllBookReviews )
router.get("/get-review/:id",getBookReviewById )

export default router;
