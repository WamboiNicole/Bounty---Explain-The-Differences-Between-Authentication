
---

# userManagement.js

This file, `userManagement.js`, centralizes the backend and frontend logic required to implement a user deletion feature in a web application. The purpose of this file is to manage the deletion of a user account by username, which is done after the user is authenticated and authorized.

## Contents

### 1. Import Statements
- **Purpose:** This section imports necessary modules and middleware required for the user deletion functionality.
- **Modules:**
  - `express`: Framework for building web applications.
  - `UserModel`: The Sequelize model for accessing user data in the database.
  - `authentication`: Middleware to ensure that the user is authenticated.
  - `authorisation`: Middleware to handle user authorization.

```javascript
const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel'); // Ensure the correct path to your UserModel
const { authentication, authorisation } = require('../middleware/authMiddleware');
```

### 2. Controller Function: `delete_user_by_username`
- **Purpose:** This function handles the logic for deleting a user from the database based on the provided username. It checks if a username is provided, attempts to delete the user, and returns appropriate success or error messages.
- **Functionality:**
  - Validates if the username is provided.
  - Attempts to delete the user from the database using Sequelize's `destroy` method.
  - Returns success or error responses based on the outcome.

```javascript
const delete_user_by_username = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const result = await UserModel.destroy({
            where: { username }
        });

        if (result) {
            return res.status(200).json({ message: `User ${username} deleted successfully.` });
        } else {
            return res.status(404).json({ message: `User ${username} not found.` });
        }
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while deleting the user.", error: error.message });
    }
};
```

### 3. Route Definition
- **Purpose:** This section defines the route that will be used to handle the user deletion request. It uses the `POST` method and is protected by authentication and authorization middleware.
- **Route:**
  - **Path:** `/delete/user`
  - **Method:** `POST`
  - **Middleware:** `authentication`, `authorisation`
  - **Handler:** Calls the `delete_user_by_username` controller function.

```javascript
router.post(
    "/delete/user",
    authentication,
    authorisation({ isAdmin: false }),
    (req, res) => delete_user_by_username(req, res)
);
```

### 4. Frontend Interaction Code
- **Purpose:** This section of code is intended for the frontend and handles user interaction with the delete functionality. It listens for form submission, captures the username input, and sends a request to the server to delete the user.
- **Functionality:**
  - Prevents the default form submission behavior.
  - Captures the username from the input field.
  - Sends a POST request to the `/delete/user` route with the username.
  - Handles the server's response, showing appropriate messages to the user.

```javascript
document.getElementById("delete-user-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const username = document.getElementById("other-username").value;
    
    try {
        const response = await fetch(`http://localhost:4001/auth/delete/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        alert(`An unexpected error occurred: ${error.message}`);
    }
});
```

### 5. Exporting the Router
- **Purpose:** Finally, the `router` is exported so it can be used in the main application. This allows the routes defined in this file to be recognized and handled by the Express.js application.

```javascript
module.exports = router;


### **Step 2: Challenge Part 2**

In the second challenge, we need to evaluate whether the requirement “This delete user functionality can be done after authentication” is a good idea or a bad idea based on our understanding of authentication and authorization.

#### Evaluation of the Requirement

Allowing a user to delete another user’s account solely after authentication is **a bad idea**. While authentication verifies that a user is who they claim to be, it does not ensure that the user has the appropriate permissions or rights to perform sensitive actions such as deleting accounts. This poses a significant security risk, as an authenticated user might have malicious intentions or could be an account that has been compromised.

#### Importance of Authentication and Authorization

- **Authentication**: This process confirms the identity of a user. It answers the question: "Are you who you say you are?" This usually involves verifying credentials like usernames and passwords.

- **Authorization**: This process determines whether an authenticated user has the permission to perform a specific action. It answers the question: "Do you have permission to do this?" Even if a user is authenticated, they may not have the right to delete another user’s account.

Separating these two concepts is crucial for maintaining security within applications. Proper authorization checks must be in place to ensure that only users with the appropriate roles (e.g., admins) can perform sensitive actions such as deleting user accounts.

### Diagram

To visualize the process of user deletion after authentication and authorization checks, see the diagram below:

![Activity Diagram](./image.png)

```


