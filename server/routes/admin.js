import express from "express";
import { checkAuth, login, signup, getLeaves, leave, getEmployees, addEmployee } from "../controllers/adminController.js";
import { protectRoute } from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.post("/signup", signup);
adminRouter.post("/login", login);
adminRouter.get("/check", protectRoute, checkAuth);
adminRouter.get("/leaves", protectRoute, getLeaves);
adminRouter.get("/employees", protectRoute, getEmployees);
adminRouter.put("/leave/:id", protectRoute, leave);
adminRouter.post("/add-employee", addEmployee);

export default adminRouter;