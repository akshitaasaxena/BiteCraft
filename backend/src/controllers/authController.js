const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Always assign "user" role, even if a different role was sent
        await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user"
        });

        res.status(201).json({
            message: "User registered successfully"
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        res.status(500).json({
            message: "Server error during registration"
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({
            message: "User not found"
        });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid password"
        });
    }
    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_SECRET, // secret lives in .env, never hardcode it in the file
        {
            expiresIn: "1d" // Token valid for 1 day
        }
    );


    res.cookie("token", token, { httpOnly: true });

    //Return token to the client
    res.json({
        message: "Login successful",
        token
    });
};

module.exports = { register, login };