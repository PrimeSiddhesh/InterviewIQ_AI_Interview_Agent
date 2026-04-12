//fronted varun data ghenar 
// create user karnar
//token generate karnar
//ani tya token la cookie madhe store karnar

//aapn json webtoken install kelay
// tar jwt seceret key ani user id ne token generate karnar

import User from "../models/user.model.js";
import genToken from "../config/token.js";

export const googleAuth=async(req,res)=>{
    try {
        //google auth logic
        
        const {name,email}=req.body;
        //check if user exists in db
        //if not create a new user
        //generate token for the user
        //store the token in cookie and send response to client

        let user = await User.findOne({email});

        if(!user){
            user=await User.create({name,email});
        }
        
        //generate token
        let token=await genToken(user._id);

        //store token in cookie
        res.cookie("token",token,{

            http:true,
            secure:false, // Set to true in production with HTTPS
            sameSite:"strict",
            maxAge:7*24*60*60*1000

        })
        return res.status(200).json(user)


    } catch (error) {
        // console.error("Error during Google authentication:", error);
   
        return res.status(500).json({message:`Google auth error ${error}`});
    }
}

export const logOut=async(req,res)=>{
    try {
        res.clearCookie("token");   
        return res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({message:`Logout error ${error}`});
    }   
}