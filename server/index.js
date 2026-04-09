import e from 'express';
import express from 'express';
import dotenv from 'dotenv';
// import { connect } from 'mongoose';
import connectDb from './config/connectDb.js';
dotenv.config();

const app =express();

const PORT = process.env.PORT || 6000;


app.get("/",(req,res)=>
{
    return res.json({message:"Server Started Successfully"});
})


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDb();
})