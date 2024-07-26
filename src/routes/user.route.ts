import { Router } from "express";
import { updateUserInformation } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.put("/update-user",verifyToken, updateUserInformation )

export default router;
