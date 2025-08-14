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
        const leaves = await LeaveRequest.find().populate("employeeId", "fullName email")

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

        const updatedLeave = await LeaveRequest.findByIdAndUpdate(id, {status}, {new: true});

        if (!updatedLeave) {
            return res.status(404).json({ success: false, message: "Leave request not found" });
        }

        if (status === "approved") {
            const employee = await Employee.findById(updatedLeave.employeeId); // assuming LeaveRequest has employeeId ref

            if (!employee) {
                return res.status(404).json({ success: false, message: "Employee not found" });
            }

            const newBalance = employee.totalLeaveBalance - updatedLeave.leaveDays;

            employee.totalLeaveBalance = newBalance >= 0 ? newBalance : 0; // prevent negative balance
            employee.leaveTaken = (employee.leaveTaken || 0) + updatedLeave.leaveDays; 
            await employee.save();
        }

        res.json({ success: true, data: updatedLeave });

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


export const getEmployees = async (req, res) => {
    try {

        const employees = await Employee.find();

        res.json({success: true, employees});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

export const addEmployee = async (req, res) => {
    const {fullName, email, department, joinDate} = req.body;

    try {
        if(!fullName || !email || !department || !joinDate){
            return res.json({success: false, message: "Missing Details"});
        }
        const parsedJoinDate = joinDate ? new Date(joinDate) : new Date();

        const user = await Employee.findOne({email});

        if(user){
            return res.json({success: false, message: "Employee already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("test@123", salt);

        const newUser = await Employee.create({
            fullName, email, password: hashedPassword, department, joinDate: parsedJoinDate
        });

        res.json({success: true, userData: newUser, message: "Account created successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}