// userManagement.js

// Import necessary modules
const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel'); // Ensure the correct path to your UserModel
const { authentication, authorisation } = require('../middleware/authMiddleware');

// Controller function to delete a user by username
const delete_user_by_username = async (req, res) => {
    try {
        const { username } = req.body;

        // Ensure a username is provided
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Delete the user from the database
        const result = await UserModel.destroy({
            where: { username }
        });

        // Check if the deletion was successful
        if (result) {
            return res.status(200).json({ message: `User ${username} deleted successfully.` });
        } else {
            return res.status(404).json({ message: `User ${username} not found.` });
        }
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while deleting the user.", error: error.message });
    }
};

// Route definition for deleting a user
router.post(
    "/delete/user",
    authentication, // Ensures the user is authenticated
    authorisation({ isAdmin: false }), // Adjust based on your authorization requirements
    (req, res) => delete_user_by_username(req, res)
);

// Frontend interaction code (to be included in a script tag or JS file)
document.getElementById("delete-user-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    // Get the username from the form
    const username = document.getElementById("other-username").value;
    
    try {
        // Send the delete request to the backend
        const response = await fetch(`http://localhost:4001/auth/delete/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username })
        });

        // Parse the JSON response
        const result = await response.json();

        // Handle the response (displaying success or error messages)
        if (response.ok) {
            alert(result.message);
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        alert(`An unexpected error occurred: ${error.message}`);
    }
});

// Export the router to use in your app
module.exports = router;
