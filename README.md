# 📄 Leave Management System

A comprehensive **Leave Management Application** for employees and admins. Employees can manage their leave requests and profiles, while admins have tools to handle leave approvals and employee management.
---
### *Deployed URL:* [Leave Management App](https://leave-mgmt-app-gilt.vercel.app/)
---

## 1. 📌 Project Overview

**Features for Employees:**
- ✏️ Sign up and log in
- 📝 Apply for leave
- 📊 Check leave balance
- 📂 View leave requests
- 👤 Manage profile

**Features for Admins:**
- 🧑‍💼 Manage employees
- ✅ Approve or ❌ reject leave requests

**Tech Stack:**
- **Backend:** Node.js, Express, MongoDB
- **Frontend:** React, TailwindCSS, Axios, React Router
- **Authentication:** JWT-based (with middleware)

---

## 2. ⚙️ Setup Instructions

### Backend (Server)
1. **Clone the repository**
    ```
    git clone <repository_url>
    cd server
    ```
2. **Install dependencies**
    ```
    npm install
    ```
3. **Create `.env` file in `/server`**
    Add keys like:
    ```
    MONGO_URI=your_database_uri
    JWT_SECRET=your_secret_key
    PORT=5000
    ```
4. **Start the backend**
    ```
    npm start
    ```

---

### Frontend (Client)
1. **Navigate to client folder**
    ```
    cd client
    ```
2. **Install dependencies**
    ```
    npm install
    ```
3. **Start the frontend**
    ```
    npm start
    ```

---

## 3. 📝 Assumptions
- Each employee has a **default leave balance** (e.g., 20 days).
- An employee **cannot** apply for leave with a **negative balance**.
- Only **admins** can approve/reject leaves and add employees.
- **JWT tokens** are used for authentication on protected routes.
- Leave requests must include `startDate`, `endDate`, and `reason`.

---

## 4. 🔒 Edge Cases Handled
- ❌ Prevent negative leave balance.
- 📧 Unique email check to prevent duplicate registration.
- ⏳ Invalid/expired JWT handled via middleware.
- 🚫 Rejected leave requests do not deduct balance.
- 🔐 Unauthorized access to admin routes blocked via middleware.

---

## 5. 🚀 Potential Improvements
- 🔑 Add **role-based authorization** (HR, Manager, etc.)
- 📩 Email/Slack notifications for leave approvals/rejections.
- 📑 Pagination and search filters for employee and leave tables.
- 🌓 Support **half-day** and **work-from-home** leave types.
- 📊 Charts & dashboards for admin analytics.

---

## 6. 📡 API Documentation

**Base URL:** `/api`

### Employee Routes (`/api/employee`)

| Route             | Method | Description |
|-------------------|--------|-------------|
| `/signup`         | POST   | Signup new employee |
| `/login`          | POST   | Employee login |
| `/checkAuth`      | GET    | Returns `{ authenticated: true/false }` |
| `/me`             | GET    | Fetch employee profile |
| `/leaves`         | GET    | Fetch all leave requests of the logged-in employee |
| `/apply-leave`    | POST   | Apply for leave |
| `/check-balance`  | GET    | Check leave balance |

---

### Admin Routes (`/api/admin`)

| Route             | Method | Description |
|-------------------|--------|-------------|
| `/signup`         | POST   | Admin signup |
| `/login`          | POST   | Admin login |
| `/checkAuth`      | GET    | Returns `{ authenticated: true/false }` |
| `/leaves`         | GET    | View all leave requests |
| `/leave/:id`      | PUT    | Approve/Reject leave request |

| `/employees`      | GET    | List all employees |
| `/add-employee`   | POST   | Add a new employee |

---

## 7. 📂 File Structure

**Backend**

server/ <br>
├── controllers/ <br>
|----employeeController.js <br>
|----adminController.js <br>
├── lib/ <br>
|----db.js <br>
|----utils.js <br>
├── middleware/ <br>
|----auth.js <br>
├── models/ <br>
|----employee.js <br>
|----admin.js <br>
├── routes/ <br>
|----employee.js <br>
|----admin.js <br>
├── .env <br>
├── server.js <br>
<br><br>

**Frontend**

client/ <br>
├── src/ <br>
│ ├── components/ <br>
|------Modal.jsx <br>
|------Layout.jsx <br>
|------Sidebar.jsx <br>
│ ├── pages/ <br>
│ ├──-- Auth/ <br>
|--------Signup.jsx <br>
|--------Login.jsx <br>
│ ├──-- Employee/ <br>
|--------LeaveRequests.jsx <br>
|--------Profile.jsx <br>
│ ├──-- Admin/ <br>
|--------Leaves.jsx <br>
|--------Employees.jsx <br>
│ ├── App.jsx <br>
│ ├── main.jsx <br>
├── tailwind.config.js <br>
├── package.json <br>


---

## 8. 🔑 Pseudocode (HLD)

**Employee Apply Leave**

IF leave balance >= requested days
CREATE leave request with status "pending"
RETURN success
ELSE
RETURN error "Insufficient leave balance"


**Admin Approve Leave**

IF approved
UPDATE leave status = 'approved'
DEDUCT leave days from employee's balance
ELSE IF rejected
UPDATE leave status = 'rejected'
DO NOT deduct leave days

---

## 9. 📊 High Level Class Diagram

Employee <br>
├── id <br>
├── name <br>
├── password <br>
├── email (unique)
├── department <br>
├── leaveBalance <br>
├── leaves [LeaveRequest] <br>

LeaveRequest <br>
├── id <br>
├── employeeId <br>
├── startDate <br>
├── endDate <br>
├── reason <br>
├── status (pending/approved/rejected) <br>

---

*This README provides setup, design, and usage documentation for the Leave Management System.*
