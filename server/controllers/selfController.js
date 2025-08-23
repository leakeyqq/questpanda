import User from "./../models/users/userInfo.js"


export const verificationSuccessful = async(req, res) => {
    try{
        console.log('hey am here updating db')
        const { userCountry } = req.body
        const userAddress = req.userWalletAddress
        if (!userCountry){
              return res.status(400).json({ error: "Country information is required" });
        }

        // Find and update the user
        const updatedUser = await User.findOneAndUpdate(
            { walletAddress: userAddress },
            {
                $set: {
                    "selfProtocol.verified": true,
                    "selfProtocol.countryOfUser": userCountry
                }
            },
            { new: true } // Return the updated document
        );

        return res.status(200).json({message: 'success', user: updatedUser})

    
    }catch(error){
        console.error("Verification update error:", error);
        return res.status(500).json({error})
    }
}
export const verificationStatus = async(req, res)=> {

    try{
        let user = await User.findOne({walletAddress: req.userWalletAddress}).lean().exec()
        return res.status(200).json({user})
    }catch(error){
        return res.status(500).json({error})
    }
}