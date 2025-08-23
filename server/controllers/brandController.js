import Decimal from 'decimal.js'
import Quest from "./../models/quests/quest.js"
import Creator from "./../models/creators/creator.js"
import {check, validationResult} from "express-validator"

export const fetchMyCreatedQuests = async(req, res)=>{
    try {
        
        const allMyCreatedQuests = await Quest.find({createdByAddress: req.userWalletAddress}).lean().exec()
        return res.status(200).json({quests: allMyCreatedQuests})
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}
export const fetchMySingleCreatedQuest = async(req, res)=>{
    try {
        const questID = req.params.questID
        const userWalletAddress = req.userWalletAddress

        if(typeof(questID) == 'undefined' || questID == null){
            return res.status(400).json({error:'cannot get questID from input'})
        }
        const singleQuest = await Quest.findById(questID).lean().exec()
        if(singleQuest){

            if(singleQuest.createdByAddress.toLowerCase() == userWalletAddress.toLowerCase()){
                return res.status(200).json({quest: singleQuest})

            }else{
                return res.status(401).json({error: "Unauthorized!"})

            }
        }else{
            return res.status(404).json({error: "Could not find quest!"})
        }
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

export const getTotalFundsSpent = async(req, res)=>{
    const walletAddress = req.userWalletAddress

    try {
        let totalSpent = new Decimal(0);    
        // const allMyCreatedQuests = await Quest.find({createdByAddress: walletAddress}).lean().exec()
        const allMyCreatedQuests = await Quest.find({
            createdByAddress: new RegExp(`^${walletAddress}$`, 'i')
          }).lean().exec();
    
        for(const quest of allMyCreatedQuests){
            if(quest.prizePoolUsd && typeof quest.prizePoolUsd === 'string'){
                try {
                    const prizeAmount = new Decimal(quest.prizePoolUsd);
                    totalSpent = totalSpent.plus(prizeAmount);
                } catch (error) {
                    throw error
                }
            }
        }

        totalSpent = totalSpent.toString()
        return res.status(200).json({totalSpent, allMyCreatedQuests})
    } catch (error) {
        return res.status(500).json({error: error.message})
    }


}
export const validate_rewardCreator = [
    check('creatorAddress')
        .notEmpty()
        .withMessage('Missing creator address!'),
    check('questOnChainId')
        .notEmpty()
        .withMessage('Quest onchain id is missing!')
]
export const rewardCreator = async(req, res)=>{
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { creatorAddress, questOnChainId } = req.body;

        // Fetch quest
        let quest = await Quest.findOne({onchain_id: questOnChainId}).exec()

        if (!quest) {
            return res.status(404).json({ error: "Quest not found/ Its an old version quest" });
        }

        // Check if the creator has already submitted
        const existingSubmission = quest.submissions.find(sub =>
            sub.submittedByAddress?.toLowerCase() === creatorAddress.toLowerCase()
        );

        if (!existingSubmission) {
            return res.status(400).json({ error: "Creator has not submitted to this quest" });
        }

        // Check if already rewarded
        if (existingSubmission.rewarded) {
            return res.status(400).json({ error: "Creator has already been rewarded for this quest" });
        }

                // Reward the creator
        existingSubmission.rewarded = true;
        existingSubmission.rewardAmountUsd = quest.pricePerVideo;
        existingSubmission.rewardedAtTime = new Date();

        await quest.save();

        // ✅ Update Creator
        const creator = await Creator.findOne({creatorAddress: new RegExp(`^${creatorAddress}$`, 'i')}).exec();
        if (creator) {
        const reward = new Decimal(quest.pricePerVideo || "0");
        const prevEarnings = new Decimal(creator.totalEarnings || "0");
        const prevBalance = new Decimal(creator.earningsBalance || "0");

        creator.totalEarnings = prevEarnings.plus(reward).toFixed();
        creator.earningsBalance = prevBalance.plus(reward).toFixed();

        // ✅ Find the existing questsDone entry and update it
        const questDoneEntry = creator.questsDone.find(
            (entry) => entry.questID === quest._id.toString()
        );

        if (questDoneEntry) {
            questDoneEntry.submissionRewarded = true;
            questDoneEntry.rewardedAmount = reward.toFixed(0);
            questDoneEntry.rewardedOn = new Date();
        }

        await creator.save();




        }
        return res.status(200).json({tokenSymbol: quest.rewardToken})


    }catch(e){
        throw e
    }

}