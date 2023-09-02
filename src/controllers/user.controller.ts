import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction, RequestHandler } from 'express'


const registerUser = asyncHandler(async(req:Request,res:Response)=>{
    const {email,username,password,role} = req.body;

})