const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password: hashedPassword,
        role: "user"
    });

    res.json({
        message: "User registered successfully"
    });
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