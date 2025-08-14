import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import employeeRouter from "./routes/Employee.js";
import adminRouter from "./routes/admin.js";


//Express APP and HTTP Server

const app = express();

//Middleware
app.use(express.json());

//for local
app.use(cors());

//connect to DB
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({ message: "Database connection failed" });
  }
});


app.get('/', (req, res) => res.send("Server is live"))


//route setup
app.use("/api/status", (req, res)=> res.send("server is live"));
app.use("/api/employee", employeeRouter);
app.use("/api/admin", adminRouter);


// if(process.env.NODE_ENV !== "production"){
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, ()=> console.log("Server is running on port: " + PORT));
// }

//export server for vercel
export default app;