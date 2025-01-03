// backend/routes/user.js
const express = require('express');
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const  { authMiddleware } = require("../middleware");

const signupBody = zod.object({
    username: zod
    .string().email()
    .min(8, "Username must be at least 8 characters long")
    .max(30, "Username must be at most 30 characters long")
    .trim()
    .toLowerCase(), // Converts input to lowercase
  password: zod
    .string()
    .min(6, "Password must be at least 6 characters long"),
  firstName: zod
    .string()
    .max(50, "First name must be at most 50 characters long")
    .trim(),
  lastName: zod
    .string()
    .max(50, "Last name must be at most 50 characters long")
    .trim(),
})

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }
    
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });
  
    var hashedPassword = await newUser.createHash(req.body.password);
    newUser.password = hashedPassword;

    // Save newUser object to database
    await newUser.save();

    const userId = newUser._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})


const signinBody = zod.object({
    username: zod
    .string().email()
    .min(8, "Username must be at least 8 characters long")
    .max(30, "Username must be at most 30 characters long")
    .trim()
    .toLowerCase(), // Converts input to lowercase
  password: zod
    .string()
    .min(6, "Password must be at least 6 characters long"),
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    let user = await User.findOne({ username: req.body.username });

    if (user === null) {
      return res.status(400).json({
        message: "User not found.",
      });
    } else {
      if (await user.validatePassword(req.body.password)) {
            const token = jwt.sign({
                userId: user._id
            }, JWT_SECRET);
        return res.status(200).json({
          message: "User Successfully Logged In",
          token: token
        });
      } else {
        return res.status(400).json({
          message: "Incorrect Password",
        });
      }
    }
});

const updateBody = zod.object({
	password: zod
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
  firstName: zod
    .string()
    .max(50, "First name must be at most 50 characters long")
    .trim()
    .optional(),
  lastName: zod
    .string()
    .max(50, "Last name must be at most 50 characters long")
    .trim()
    .optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success, error } = updateBody.safeParse(req.body);

    if (!success) {
        // If validation fails, return validation errors in the response
        return res.status(400).json({
            message: "Validation failed",
            errors: error.format()
        });
    }

    // Check if the password is being updated
    if (req.body.password) {
        // If a password is provided, hash it
        try {
            const newUserInstance = new User();
            const hashedPassword = await newUserInstance.createHash(req.body.password);
            req.body.password = hashedPassword; // Save the hashed password
        } catch (err) {
            return res.status(500).json({
                message: "Error hashing password"
            });
        }
    }

    try {
        // Update the user document
        const updatedUser = await User.updateOne(
            { _id: req.userId }, // Filter by user ID (from the auth middleware)
            { $set: req.body } // Update the fields passed in the request body
        );

        // If no document was updated, respond with an error
        if (updatedUser.modifiedCount === 0) {
            return res.status(404).json({
                message: "User not found or no changes made"
            });
        }

        res.json({
            message: "User information updated successfully"
        });
    } catch (err) {
        // If an error occurs during the update, return a generic error
        console.error(err);
        res.status(500).json({
            message: "Error while updating user information"
        });
    }
});

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;