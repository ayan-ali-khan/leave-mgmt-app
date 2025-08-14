import express from "express";
import { checkAuth, login, signup, applyLeave, getLeaves, checkBalance, user } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const employeeRouter = express.Router();

employeeRouter.post("/signup", signup);
employeeRouter.post("/login", login);
employeeRouter.get("/check", protectRoute, checkAuth);
employeeRouter.get("/leaves",protectRoute, getLeaves);
employeeRouter.post("/apply-leave", protectRoute, applyLeave);
employeeRouter.get("/check-balance", protectRoute, checkBalance);
employeeRouter.get("/me", protectRoute, user);

export default employeeRouter;