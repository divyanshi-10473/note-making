const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const { JWT_SECRET } = process.env;

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
     
      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
  
     
      const checkUsername = await User.findOne({ username });
      if (checkUsername) {
        return res.status(400).json({ success: false, message: "Username already taken" });
      }
  
     
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashPassword,
      });
  
      await newUser.save();
  
      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const Checkuser = await User.findOne({ email });
        if (!Checkuser) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        const isMatch = await bcrypt.compare(password, Checkuser.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const token = jwt.sign({ id: Checkuser._id, name:Checkuser.username, email:Checkuser.email }, JWT_SECRET, { expiresIn: "1h" });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false
        }).json({
            success: true,
            message: "Logged in successfully",
            user: {
                email: Checkuser.email,
                username: Checkuser.username,
                id: Checkuser._id,
            }
         
        });
    
    
        
    } catch (error) {
        res.status(500).json({
            success: false,
             message: "Internal server error" });
    }
}

module.exports = {
    registerUser,
    loginUser,
}
