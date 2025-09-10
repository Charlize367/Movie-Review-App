import mongoose from "mongoose";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";




export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {username , email, password, role} = req.body;

        const existingUser = await User.findOne({ email, username });

        if(existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const newUsers = await User.create([{username, email, password: hashedPassword, role}], { session });
    
        const token = jwt.sign({userId : newUsers[0]._id }, JWT_SECRET, {expiresIn :JWT_EXPIRES_IN})
        await session.commitTransaction();
       

        res.status(201).json({
            success:true,
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0],
            }
        })
         session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { username, password} = req.body;

        const user = await User.findOne({ username });

        if(!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            const error = new Error('Invalid Password');
            error.statusCode(401);
            throw error;
        }

        const token = jwt.sign({userId: user._id }, JWT_SECRET, {expiresIn : JWT_EXPIRES_IN});

        res.status(200).json({
            success:true,
            message: 'User signed in successfully',
            data : {
                token,
                user,
            }
        })
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {
   

}