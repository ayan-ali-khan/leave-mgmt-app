import mongoose from "mongoose";

// Employee Schema
const employeeSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    fullName: {type: String, required: true},
    password: {type: String, required: true, minLength: 5},
    department: String,
    joinDate: { type: Date, required: true },
    totalLeaveBalance: { type: Number, default: 20 },
    leaveTaken: { type: Number, default: 0 },
}, { timestamps: true });

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;