# Paytm Clone App

## Description
This is a simple **Paytm Clone App** that provides core functionalities for user management and money transfer. It allows users to:

- **Sign Up** as a new user.
- **Sign In** to their account.
- **Update User Details**.
- **Check Account Balance**.
- **Transfer Money** to friends.
- **Search for Friends** by their name.

The app simulates essential features of a payment platform, making it a great learning project for web development and backend APIs.

---

## Features
1. **User Management**:
   - New users can create an account (sign up).
   - Existing users can log in (sign in).
   - Users can update their profile details.

2. **Account Management**:
   - View current account balance.
   - Transfer money to other users.

3. **Friend Search**:
   - Find friends by searching for their names.

---

## Technologies Used
- **Frontend**: React.js (or your chosen frontend framework)
- **Backend**: Node.js and Express.js
- **Database**: MongoDB (or your preferred database)
- **API Client**: Axios (for frontend-backend communication)

---

## Installation and Setup

### Prerequisites
Ensure you have the following installed on your system:
- Node.js
- MongoDB (or access to a cloud database)
- Git

### Steps to Run the App Locally

1. **Clone the Repository**:
   ```bash
   https://github.com/adityamishra28203/Cohort.git
   cd Cohort
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
     ```env
     PORT=3000
     DATABASE_URL=<your-mongodb-connection-string>
     JWT_SECRET=<your-jwt-secret>
     ```

4. **Start the Backend Server**:
   ```bash
   npm start
   ```

5. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

6. **Start the Frontend**:
   ```bash
   npm run dev
   ```
---

## API Endpoints

### User
- **POST /api/v1/user/signup**: Register a new user.
- **POST /api/v1/user/signin**: Log in an existing user.
- **PUT /api/v1/user/**: Update the details for logged in user user.

### Account
- **GET /api/v1/account/balance**: Get the user's account balance.
- **POST /api/v1/account/transfer**: Transfer money to another user.

### Friends
- **GET /api/v1/user/bulk?filter=**: Search for friends by name.

---

## Future Enhancements
Some features planned for future releases include:
- Adding transaction history.
- Integration with a real payment gateway.
- Two-factor authentication for enhanced security.
- Notification system for successful transactions.


