import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import Employee from "../models/Employee.js";
import LeaveRequest from "../models/LeaveRequest.js";

export const signup = async (req, res) => {
    const {fullName, email, password, department, joinDate} = req.body;

    try {
        if(!fullName || !email || !password || !department || !joinDate){
            return res.json({success: false, message: "Missing Details"});
        }
        const user = await Employee.findOne({email});

        if(user){
            return res.json({success: false, message: "Admin already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await Employee.create({
            fullName, email, password: hashedPassword, department, joinDate
        });

        const token = generateToken(newUser._id);

        res.json({success: true, userData: newUser, token, message: "Account created successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//LOGIN
export const login = async (req, res)=>{
    try {
        const {email, password} = req.body;
        const userData = await Employee.findOne({email})

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if(!isPasswordCorrect){
            return res.json({success: false, message: "Invalid Credentials"});
        }

        const token = generateToken(userData._id);

        res.json({success: true, userData, token, message: "Login successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success: true, message: error.message});
    }
}

//controller to check if user is authenticated
export const checkAuth = (req, res)=>{
    res.json({success: true, user: req.user});
}


//get all users except logged in user
export const getLeaves = async (req, res) => {
    try {
        const leaves = await LeaveRequest.find().populate("employeeId")

        res.json({success: true, leaves});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//update leave status
export const leave = async (req, res) => {
    try {
        const {id} = req.params;
        const {status} = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const updatedLeave = await LeaveRequest.findByIdAndUpdate(id, {status});

        if (!updatedLeave) {
            return res.status(404).json({ success: false, message: "Leave request not found" });
        }

        if (["approved"].includes(status)) {
            await Employee.findByIdAndUpdate(id, {status: "approved"});

        }

        res.json({ success: true, data: updatedLeave });

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//send message to selected user
export const leaveBalance = async (req, res) => {
    try {
        const {id} = req.params;

        const leaves = await Employee.findById(id).select("totalLeaveBalance");

        res.json({success: true, leaves});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}