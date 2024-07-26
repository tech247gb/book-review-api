import { Router } from "express";
import { login, signup, verifyJwtToken } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signup",signup )
router.post("/login",login )
router.get("/verify-jwt", verifyToken, verifyJwtToken);



export default router;
