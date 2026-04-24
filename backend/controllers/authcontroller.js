import User from '../models/user.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser =async (req,res)=>{
    try{
        const username = req.body.username?.trim();
        const password = req.body.password?.trim();
        if(!username || !password){
            return res.status(400).json({
                success: false, 
                message: 'Username and Password are required' 
            });
        }
        if (!username || username.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Username must be at least 3 characters"
            });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }
        const existUser = await User.findOne({username});
        if(existUser){
            return res.status(400).json({
                success: false, 
                message: 'Username already exists' 
            });
        }

        const hashedpassword = await bcrypt.hash(password,10);

        const newUser = await User.create({username,password:hashedpassword});
        return res.status(201).json({
            success: true,
            message: `Account Created Successfully,Welcome ${username}`});
    }catch(err){
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
};

export const loginUser =async (req,res)=>{
    try{
        const username = req.body.username?.trim();
        const password = req.body.password?.trim();
        if(!username || !password){
            return res.status(400).json({
                success: false, 
                message: 'Username and Password are required' 
            });
        }
        const user = await User.findOne({username});
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const token = jwt.sign({ userId: user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        return res.status(200).json({ 
            success: true,
            message: `Login Successful,Welcome back ${username}`,
            data:{token,userId: user._id}});
    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};