import { generateToken } from "../lib/utils.js";
import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import LeaveRequest from "../models/LeaveRequest.js";

//Signup
export const signup = async (req, res) => {
    const {fullName, email, password, department, joinDate} = req.body;

    try {
        if(!fullName || !email || !password || !department || !joinDate){
            return res.json({success: false, message: "Missing Details"});
        }
        const parsedJoinDate = joinDate ? new Date(joinDate) : new Date();

        const user = await Employee.findOne({email});

        if(user){
            return res.json({success: false, message: "Account already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await Employee.create({
            fullName, email, password: hashedPassword, department, joinDate: parsedJoinDate
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

        if (!userData) {
            console.log("Invalid Credentials");
            
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if(!isPasswordCorrect){
            return res.json({success: false, message: "Invalid Password"});
        }

        const token = generateToken(userData._id);

        res.json({success: true, userData, token, message: "Login successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//controller to check if user is authenticated
export const checkAuth = (req, res)=>{
    res.json({success: true, user: req.user});
}

export const getLeaves = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === "employee") {
            query.employeeId = req.user._id;
        }

        const leaves = await LeaveRequest.find(query).populate("employeeId")

        res.json({success: true, leaves});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//controller to apply Leave
export const applyLeave = async (req, res) => {
    try {
        const {startDate, endDate, reason} = req.body;

        const userId = req.user._id;

        const noOfDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

        if(startDate > endDate || noOfDays<1){
            return res.json({success: false, message: "Invalid Dates"});
        }

        const leave = await LeaveRequest.create({
            employeeId: userId,
            startDate, 
            endDate, 
            numberOfDays: noOfDays,
            reason,
        });

        res.json({success: true, leave, message: "Leave applied successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

export const checkBalance = async (req, res) => {
    try {
        const userId = req.user._id;
        const employee = await Employee.findById(userId);
        // console.log(employee.totalLeaveBalance);
        const remaining = employee.totalLeaveBalance;
        if(!remaining){
            return res.json({success: false, message: "No leave balance found"});
        }

        res.json({success: true, remaining});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

export const user = async (req, res) => {
    try {
        const userId = req.user._id;
        const employee = await Employee.findById(userId);

        if(!employee){
            return res.json({success: false, message: "No employee found"});
        }

        res.json({success: true, employee});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
