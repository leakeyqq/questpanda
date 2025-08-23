import mongoose from "mongoose";
import Quest from "../models/quests/quest.js"
import Creator from "../models/creators/creator.js"
import dotenv from 'dotenv'
import axios from 'axios';
import * as cheerio from 'cheerio';
import chalk from 'chalk';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config()

import { check, validationResult } from "express-validator"


export const validate_createQuest = [
  check("brand")
    .trim()
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ max: 100 })
    .withMessage("Brand name must not exceed 100 characters"),

  check("title")
    .trim()
    .notEmpty()
    .withMessage("Quest title is required")
    .isLength({ max: 100 })
    .withMessage("Title must not exceed 100 characters"),

  check("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),

  // check("description")
  //   .isLength({ min: 20 })
  //   .withMessage("Short description must be 20 characters or more"),

  check("longDescription")
    .trim()
    .notEmpty()
    .withMessage("Detailed description is required")
    // .isLength({ min: 20 })
    .withMessage("Detailed description must be at least 20 characters long"),

  check("prizePool")
    .notEmpty()
    .withMessage("Prize pool is required"),
  // .isFloat({ gt: 0 })
  // .withMessage("Prize pool must be a positive number"),

  check("deadline")
    .notEmpty()
    .withMessage("Deadline is required")
    .isISO8601()
    .toDate()
    .withMessage("Deadline must be a valid date"),

  check("minFollowers")
    .optional(),
  // .isInt({ min: 0 })
  // .withMessage("Minimum followers must be a non-negative integer"),

  check("imageUrl")
    .isURL()
    .withMessage("Image URL must be a valid URL"),

  // You can add more fields as needed.
  // check("rewardCriteria")
  //     .notEmpty()
  //     .withMessage('Reward criteria should not be empty!'),

  check("videosToReward")
    .notEmpty()
    .withMessage('The number of videos to reward cannot be empty'),
  check("rewardPerVideo")
    .notEmpty()
    .withMessage('The reward per video cannot be empty!'),
  check("onchainQuestId")
    .optional(),
  check('solanaTxId')
    .optional(),
  check("rewardToken")
    .notEmpty()
    .withMessage("Reward token missing!"),
  check('network')
    .notEmpty()
    .withMessage("Blockchain network is not specified")
];


export const handleQuestCreation = async (req, res) => {
  // console.log('req.body ', req.body)
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Process platform requirements
    const platformRequirements = req.body.platformRequirements || [];

    // Map platform requirements to socialPlatformsAllowed structure
    const socialPlatformsAllowed = {
      twitter: { allowedOnCampaign: false, minFollowers: 0 },
      tiktok: { allowedOnCampaign: false, minFollowers: 0 },
      instagram: { allowedOnCampaign: false, minFollowers: 0 }
    };


    platformRequirements.forEach(req => {
      if (!req.platform) return;

      const platformKey = req.platform.includes('TikTok') ? 'tiktok' :
        req.platform.includes('Instagram') ? 'instagram' :
          req.platform.includes('Twitter') ? 'twitter' : null;

      if (platformKey) {
        socialPlatformsAllowed[platformKey] = {
          allowedOnCampaign: req.enabled || false,
          minFollowers: req.enabled ? (req.minFollowers ? parseInt(req.minFollowers) : 0) : 0
        };
      }
    });

    // Determine approval needed based on participation type
    const approvalNeeded = req.body.participationType === 'approval';


    // Create quest document
    const quest = new Quest({
      createdByAddress: req.userWalletAddress,
      onchain_id: req.body.onchainQuestId,
      title: req.body.title,
      brandName: req.body.brand,
      brandImageUrl: req.body.imageUrl,
      description: req.body.longDescription,
      prizePoolUsd: req.body.prizePool,
      minFollowerCount: req.body.minFollowers ? parseInt(req.body.minFollowers) : 0,
      endsOn: req.body.deadline,
      pricePerVideo: req.body.rewardPerVideo,
      videosToBeAwarded: parseInt(req.body.videosToReward),
      rewardToken: req.body.rewardToken,
      approvalNeeded,
      socialPlatformsAllowed,
      visibleOnline: true,
      applicants: [],
      submissions: [],
      network: req.body.network
    });

    if(req.body.network == 'solana'){
      quest.solanaNetwork.usedSolana = true
      quest.solanaNetwork.txId = req.body.solanaTxId
    }

    // throw new Error('cancelled quest creation intentionally!')

    await quest.save();
    res.status(201).json({ message: "Quest created successfully", quest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating quest", error: err.message });
  }
}

export const getAllQuests = async (req, res) => {
  try {

    // const allQuests = await Quest.find({visibleOnline: true}).lean().exec()
    const allQuests = await Quest.find({ visibleOnline: true }, { brandName: 1, brandImageUrl: 1, description: 1, prizePoolUsd: 1, endsOn: 1, pricePerVideo: 1, onchain_id: 1, rewardToken: 1, approvalNeeded: 1 }).sort({ createdAt: -1 }).lean().exec()
    return res.status(200).json({ allQuests })
  } catch (e) {
    return res.status(500).json({ "error": e.message })
  }
}

export const getSingleQuest = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.questID).lean().exec()
    if (quest) {
      return res.status(200).json({ quest })
    } else {
      return res.status(404)
    }
  } catch (e) {
    return res.status(500).json({ "error": e.message })
  }
}

export const get3questsOnly = async (req, res) => {
  try {
    const _3quests = await Quest.find({ visibleOnline: true }, { brandName: 1, brandImageUrl: 1, description: 1, prizePoolUsd: 1, endsOn: 1, pricePerVideo: 1, onchain_id: 1, rewardToken: 1, approvalNeeded: 1 }).sort({ createdAt: -1 }).limit(3).lean().exec()
    return res.status(200).json({ _3quests })
  } catch (error) {
    return res.status(500).json({ "error": error.message })
  }
}

export const validate_questSubmission = [
  check("platform")
    .notEmpty().withMessage("Social media platform was not selected!")
    .trim(),
  check("contentUrl")
    .notEmpty().withMessage("Video URL should not be empty!")
    .isURL().withMessage('The Video URL submitted is not valid')
    .trim()
]

export const submitQuestByCreator = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({ error: firstError });
  }

  try {
    const questID = req.params.questID
    const walletID = req.userWalletAddress
    let applicantUsername

    const quest = await Quest.findById(questID);
    if (!quest) {
      throw new Error('Quest not found');
    }

    // 2. Then check if user has already submitted
    const userAlreadySubmitted = quest.submissions.some(
      submission => submission.submittedByAddress == walletID
    );



    if (userAlreadySubmitted) {
      return res.status(400).json({
        error: {
          msg: "Oops..You cannot submit a single quest twice😪"
        }
      });
    }

      if (new Date(quest.endsOn) < new Date()) {
      return res.status(400).json({ 
        error: { 
          msg: "This quest has already ended" 
        } 
      });
    }

    // Check if quest requires approval and user is approved
    if (quest.approvalNeeded) {
      // Also make sure the content creator is submitting from the same profile they used to apply
      const applicant = quest.applicants.find(app => app.userWalletAddress === walletID);

      if (!applicant) {
        return res.status(403).json({
          error: {
            msg: "Approval required: You need to apply and be approved before submitting"
          }
        });
      }

      if (!applicant.approved) {
        return res.status(403).json({
          error: {
            msg: applicant.rejected
              ? "Your application was rejected for this quest"
              : "Your application is still pending approval"
          }
        });
      }

      // Verify submission platform matches approved platform if specified
      if (applicant.platform && applicant.platform !== req.body.platform) {
        return res.status(400).json({
          error: {
            msg: `You must submit content from ${applicant.platform} as per your approved application`
          }
        });
      }

      // Get the username from the applicant's data
      applicantUsername = applicant[applicant.platform]?.userName

      if (!applicantUsername) {
        throw new Error('Could not fetch the username of the applicant!')
      }


    }

    let updatedQuest

    if (req.body.platform.toLowerCase() === 'twitter') {
      if (quest.approvalNeeded) {
        let twitterUsername = extractTwitterUsername(req.body.contentUrl)
        if (twitterUsername != applicantUsername) {
          throw new Error('This social media profile does not match with the one that was approved! Please use the same profile.')
        }
      }

      updatedQuest = await pullTwitterData_v2(walletID, req.body.contentUrl, questID, quest.createdAt)
    } else if (req.body.platform.toLowerCase() === 'tiktok') {

      if (quest.approvalNeeded) {
        let tiktokUsername = extractTikTokUsername(req.body.contentUrl)
        if (tiktokUsername != applicantUsername) {
          throw new Error('This social media profile does not match with the one that was approved! Please use the same profile.')

        }
      }
      await pullTikTokData_v2(walletID, req.body.contentUrl, questID, quest.createdAt)
    } else if (req.body.platform.toLowerCase() === 'instagram') {
      await pullInstagramData_v2(walletID, req.body.contentUrl, questID, quest.createdAt, applicantUsername, quest.approvalNeeded)
    }

    return res.status(200).json({ updatedQuest })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ "error": error.message })
  }


}


function cleanTwitterUrl(url) {
  if (!url) return null;
  
  // Remove everything after the '?' including the '?'
  const cleanUrl = url.split('?')[0];
  
  // Validate the URL structure
  if (!cleanUrl.match(/^(https?:\/\/)(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/i)) {
    throw new Error('Not sure this is an X post')
    // return null; // or throw an error if you prefer
  }
  
  return cleanUrl;
}

async function pullTwitterData_v2(walletID, unclean_contentUrl, questID, questCreatedOn) {
  let contentUrl = cleanTwitterUrl(unclean_contentUrl)
  validateTwitterUrl(contentUrl)
  const { data } = await axios.get(
    `https://api.scrapecreators.com/v1/twitter/tweet?url=${contentUrl}`,
    {
      headers: {
        'x-api-key': process.env.SCRAPECREATOR_API_KEY
      }
    }
  )

  if (!data) throw new Error('Could not fetch data')

  // Verify the video post was not created before the quest began
  let postMadeOn = new Date(data.legacy.created_at)
  if (postMadeOn < questCreatedOn) {
    throw new Error('This post appears to be old! Please submit a recent post')
  }


  // Check if the tweet contains a video
  const hasVideo = data.legacy.entities?.media?.some(media => media.type === 'video');
  if (!hasVideo) {
    throw new Error('No video found in this tweet. Please submit a post containing a video.');
  }


  const updatedCreator = await Creator.findOneAndUpdate(
    { creatorAddress: walletID },
    {
      $push: {
        questsDone: {
          questID: questID,
          platformPosted: 'twitter',
          videoUrl: contentUrl,
          submittedOn: new Date()
        }
      }
    },
    {
      upsert: true,
      new: true,
    }
  );

  console.log('raw photo ', data.core.user_results.result.avatar.image_url )
  const displayPhoto = await processProfilePictureOnCloudy(data.core.user_results.result.avatar.image_url)
  console.log('cloudy photo ', displayPhoto)

  let creatorData_twitter = {
    name: data.core.user_results.result.core.name,
    userName: data.core.user_results.result.core.screen_name,
    url: `https://x.com/${data.core.user_results.result.core.screen_name}`,
    followers: data.core.user_results.result.legacy.followers_count,
    following: data.core.user_results.result.legacy.friends_count,
    cloudinary_profilePicture: displayPhoto
  }

  if (creatorData_twitter) {
    await Creator.updateOne(
      { creatorAddress: walletID },
      { $unset: { twitterData: "" } }
    );

    const creatorUpdateData = {
      $set: { twitterData: creatorData_twitter }
    };

    const updatedCreator = await Creator.findOneAndUpdate(
      { creatorAddress: walletID },
      creatorUpdateData,
      {
        upsert: true,
        new: true,
      }
    );

    // Update submission data

    const submissionData_twitter = {
      retweetCount: data.legacy.retweet_count,
      replyCount: data.legacy.reply_count,
      likeCount: data.legacy.favorite_count,
      quoteCount: data.legacy.quote_count,
      viewCount: data.views.count,
      createdAt: new Date(data.legacy.created_at),
      bookmarkCount: data.legacy.bookmark_count,
      author: creatorData_twitter
    }

    const updatedQuest = await Quest.findByIdAndUpdate(
      questID,
      {
        $push: {
          submissions: {
            submittedByAddress: walletID,
            socialPlatformName: 'twitter',
            videoLink: contentUrl,
            submittedAtTime: new Date(),
            socialStatsLastUpdated: new Date(),
            twitterData: submissionData_twitter
          }
        }
      },
      { new: true }
    )

    return updatedQuest


  }
}
async function pullTikTokData_v2(walletID, contentUrl, questID, questCreatedOn) {

  let tiktokUsername = extractTikTokUsername(contentUrl)

  const { data } = await axios.get(
    `https://api.scrapecreators.com/v2/tiktok/video?url=${contentUrl}`,
    {
      headers: {
        'x-api-key': process.env.SCRAPECREATOR_API_KEY
      }
    }
  );


  const { data: profileData } = await axios.get(
    `https://api.scrapecreators.com/v1/tiktok/profile?handle=${tiktokUsername}`,
    {
      headers: {
        'x-api-key': process.env.SCRAPECREATOR_API_KEY
      }
    }
  );


  if (!data) throw new Error('Could not fetch data')
  if (!profileData) throw new Error('Could not fetch profile data')


  // Verify the video post was not created before the quest began
  let unixTimestamp = data.aweme_detail.create_time
  let postMadeOn = new Date(unixTimestamp * 1000);
  if (postMadeOn < questCreatedOn) {
    throw new Error('This post appears to be old! Please submit a recent post')
  }


  const updatedCreator = await Creator.findOneAndUpdate(
    { creatorAddress: walletID },
    {
      $push: {
        questsDone: {
          questID: questID,
          platformPosted: 'tiktok',
          videoUrl: contentUrl,
          submittedOn: new Date()
        }
      }
    },
    {
      upsert: true,
      new: true,
    }
  );

  console.log('raw photo ', data.aweme_detail.author.avatar_thumb.uri)
   const displayPhoto = await processProfilePictureOnCloudy(profileData.user.avatarThumb)
   console.log('final photo ', displayPhoto)

  let creatorData_tiktok = {
    name: data.aweme_detail.author.nickname,
    userName: data.aweme_detail.author.unique_id,
    followers: profileData.statsV2.followerCount,
    following: profileData.statsV2.followingCount,
    cloudinary_profilePicture: displayPhoto
  }

  if (creatorData_tiktok) {
    await Creator.updateOne(
      { creatorAddress: walletID },
      { $unset: { tiktokData: "" } }
    );

    const creatorUpdateData = {
      $set: { tiktokData: creatorData_tiktok }
    };

    const updatedCreator = await Creator.findOneAndUpdate(
      { creatorAddress: walletID },
      creatorUpdateData,
      {
        upsert: true,
        new: true,
      }
    );

    // Update submission data

    const submissionData_tiktok = {
      replyCount: data.aweme_detail.statistics.comment_count,
      likeCount: data.aweme_detail.statistics.digg_count,
      viewCount: data.aweme_detail.statistics.play_count,
      createdAt: postMadeOn,
      bookmarkCount: data.aweme_detail.statistics.collect_count,
      author: creatorData_tiktok
    }


    const updatedQuest = await Quest.findByIdAndUpdate(
      questID,
      {
        $push: {
          submissions: {
            submittedByAddress: walletID,
            socialPlatformName: 'tiktok',
            videoLink: contentUrl,
            submittedAtTime: new Date(),
            socialStatsLastUpdated: new Date(),
            tiktokData: submissionData_tiktok
          }
        }
      },
      { new: true }
    )

    return updatedQuest


  }
}
async function pullInstagramData_v2(walletID, contentUrl, questID, questCreatedOn, applicantUsername, approvalNeeded) {

  let video_view_count

  const { data } = await axios.get(
    `https://api.scrapecreators.com/v1/instagram/post?url=${contentUrl}`,
    {
      headers: {
        'x-api-key': process.env.SCRAPECREATOR_API_KEY
      }
    }
  );

  if (!data) throw new Error('Could not fetch data')

  if (approvalNeeded) {
    if (data.data.xdt_shortcode_media.owner.username != applicantUsername) {
      throw new Error('This social media profile does not match with the one that was approved! Please use the same profile.')
    }
  }

  // Check for presence of video
  if (!data.data.xdt_shortcode_media.is_video) {
    // Check for video in the post
    const hasVideo = data.data?.xdt_shortcode_media?.edge_sidecar_to_children?.edges?.some(
      edge => edge.node.__typename === 'XDTGraphVideo'
    );
    if (!hasVideo) {
      throw new Error('No video found in this Instagram post. Please submit a post containing a video.');
    }

    // Get view count from carousel video
    const videoNode = data.data.xdt_shortcode_media.edge_sidecar_to_children.edges.find(edge => edge.node.__typename === 'XDTGraphVideo').node;

    video_view_count = videoNode.video_view_count
  } else {
    video_view_count = data.data.xdt_shortcode_media.video_play_count
  }


  // Verify the video post was not created before the quest began
  let unixTimestamp = data.data.xdt_shortcode_media.taken_at_timestamp
  let postMadeOn = new Date(unixTimestamp * 1000);

  if (postMadeOn < questCreatedOn) {
    throw new Error('This post appears to be old! Please submit a recent post')
  }


  const updatedCreator = await Creator.findOneAndUpdate(
    { creatorAddress: walletID },
    {
      $push: {
        questsDone: {
          questID: questID,
          platformPosted: 'instagram',
          videoUrl: contentUrl,
          submittedOn: new Date()
        }
      }
    },
    {
      upsert: true,
      new: true,
    }
  );

   const displayPhoto = await processProfilePictureOnCloudy(data.data.xdt_shortcode_media.owner.profile_pic_url)


  let creatorData_instagram = {
    name: data.data.xdt_shortcode_media.owner.full_name,
    userName: data.data.xdt_shortcode_media.owner.username,
    followers: data.data.xdt_shortcode_media.owner.edge_followed_by.count,
    cloudinary_profilePicture: displayPhoto
  }

  if (creatorData_instagram) {
    await Creator.updateOne(
      { creatorAddress: walletID },
      { $unset: { instagramData: "" } }
    );

    const creatorUpdateData = {
      $set: { instagramData: creatorData_instagram }
    };

    const updatedCreator = await Creator.findOneAndUpdate(
      { creatorAddress: walletID },
      creatorUpdateData,
      {
        upsert: true,
        new: true,
      }
    );

    // Update submission data
    const submissionData_instagram = {
      replyCount: data.data.xdt_shortcode_media.edge_media_preview_comment.count,
      likeCount: data.data.xdt_shortcode_media.edge_media_preview_like.count,
      viewCount: video_view_count,
      createdAt: postMadeOn,
      author: creatorData_instagram
    }


    const updatedQuest = await Quest.findByIdAndUpdate(
      questID,
      {
        $push: {
          submissions: {
            submittedByAddress: walletID,
            socialPlatformName: 'instagram',
            videoLink: contentUrl,
            submittedAtTime: new Date(),
            socialStatsLastUpdated: new Date(),
            instagramData: submissionData_instagram
          }
        }
      },
      { new: true }
    )

    return updatedQuest


  }
}


function extractTwitterUsername(url) {
  try {
    const cleanedUrl = url.split('?')[0]; // Remove query parameters
    const match = cleanedUrl.match(/x\.com\/([^/]+)\/status/);
    return match ? match[1] : null;
  } catch {
    throw new Error('Could not extract Twitter username!')
    // return null;
  }
}
function extractTikTokUsername(url) {
  // Regular expression to match TikTok username
  const usernameMatch = url.match(/tiktok\.com\/@([^/?]+)/);

  if (!usernameMatch || !usernameMatch[1]) {
    throw new Error('Invalid TikTok URL: Could not extract username');
  }

  return usernameMatch[1];
}
function validateTwitterUrl(url) {
  // Basic URL validation
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid input: URL must be a string');
  }

  // Standard Twitter/X URL patterns
  const twitterUrlPatterns = [
    /^https?:\/\/(www\.)?x\.com\/[a-zA-Z0-9_]+\/status\/\d+/i,       // New X.com format
    /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/status\/\d+/i,  // Legacy Twitter format
    /^https?:\/\/(www\.)?x\.com\/i\/web\/status\/\d+/i,               // Mobile share format
  ];

  // Check if URL matches any valid pattern
  const isValid = twitterUrlPatterns.some(pattern => pattern.test(url));

  if (!isValid) {
    throw new Error('We detected that the link you submitted is not a valid X URL.')
    // throw new Error(
    //   'Invalid Twitter/X URL. Expected formats:\n' +
    //   '- https://x.com/username/status/123456789\n' +
    //   '- https://twitter.com/username/status/123456789\n' +
    //   '- https://x.com/i/web/status/123456789'
    // );
  }

  return true;
}


async function processProfilePictureOnCloudy(imageUrl) {

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  });

  if (!imageUrl) return null;

  try {
    // Download the image
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'arraybuffer'
    });

    // Convert to base64 for Cloudinary
    const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
    const dataUri = `data:${response.headers['content-type']};base64,${imageBase64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'creator_profile_pictures',
      use_filename: true,
      unique_filename: true,
      quality: 'auto:good',
      width: 300,
      height: 300,
      crop: 'fill'
    });

    return result.secure_url;
  } catch (error) {
    console.error(`Failed to process image ${imageUrl}:`, error);
    return null;
  }
}