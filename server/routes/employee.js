import express from "express";
import { checkAuth, login, signup, applyLeave, checkStatus } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const employeeRouter = express.Router();

employeeRouter.post("/signup", signup);
employeeRouter.post("/login", login);
employeeRouter.get("/check", protectRoute, checkAuth);
employeeRouter.post("/apply-leave", protectRoute, applyLeave);
employeeRouter.get("/check-status", protectRoute, checkStatus);

export default employeeRouter;