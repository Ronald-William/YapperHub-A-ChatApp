import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "7d"});
}

export const registerUser = async(req,res)=>{
    const {name, email, password} = req.body;
    const userExists = await User.findOne({email});
    if(userExists) return res.status(400).json({message: "User already exists"});

    const user = await User.create({name,email,password});
    
    const Token = generateToken(user._id);
    res.cookie("token", Token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    } );
    
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email
    });
}

export const loginUser = async(req,res)=>{
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user || !(await user.matchPassword(password))){
        return res.status(401).json({message: "Invalid credentials"});
    }

    const Token = generateToken(user._id);
    res.cookie("token", Token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    } );
    
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email
    });
}

export const logoutUser = async(req,res)=>{
    res.cookie("token", "" , {expires: new Date(0)});
    res.json({message: "Logged out"});
}