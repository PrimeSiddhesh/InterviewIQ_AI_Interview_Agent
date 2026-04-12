import express from "express";
import { googleAuth, logOut } from "../controllers/auth.controller.js";
import { auth } from "../../client/src/utils/firebase.js";

const authRouter=express.Router();


authRouter.post("/google",googleAuth)
authRouter.get("/logout",logOut)

export default authRouter;