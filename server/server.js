import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import employeeRouter from "./routes/Employee.js";
import adminRouter from "./routes/admin.js";


//Express APP and HTTP Server

const app = express();
const server = http.createServer(app);

//initialize socket.io server

//Middleware
app.use(express.json({limit: "4mb"}));

//for local
app.use(cors({
    origin: 'http://localhost:5173', // your frontend origin
    credentials: true               // allow cookies / auth headers
}));


//route setup
app.use("/api/status", (req, res)=> res.send("server is live"));
app.use("/api/employee", employeeRouter);
app.use("/api/admin", adminRouter);

//connect to DB
await connectDB();

if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, ()=> console.log("Server is running on port: " + PORT));
}

//export server for vercel
export default server;