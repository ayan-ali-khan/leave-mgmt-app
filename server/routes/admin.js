import express from "express";
import { checkAuth, login, signup, getLeaves, leave, leaveBalance } from "../controllers/adminController.js";
import { protectRoute } from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.post("/signup", signup);
adminRouter.post("/login", login);
adminRouter.get("/check", protectRoute, checkAuth);
adminRouter.get("/leaves", protectRoute, getLeaves);
adminRouter.put("/leave/:id", protectRoute, leave);
adminRouter.get("/leave-balance/:id", protectRoute, leaveBalance);

export default adminRouter;