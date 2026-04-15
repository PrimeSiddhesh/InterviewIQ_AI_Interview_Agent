import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {

    try {
        const userId=req.userId;
        const user=await User.findById(userId);

        if(!user)
        {
            return res.status(404).json({message:"User Not Found"});
        }

        return res.status(200).json(user);
        
    } catch (error) {
        // console.error(error);
        return res.status(500).json({message: `failed to get current user ${error}`} );
    }

}