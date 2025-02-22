import User from "../models/user.models.js";
import Post from "../models/post.model.js";
import Notification from "../models/notificatio.model.js";
import {v2 as cloudinary} from "cloudinary"


export const createPost = async (req, res) => {
	try {
		const { text } = req.body;
		let { img } = req.body;
		const userId = req.user._id.toString();

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if (!text && !img) {
			return res.status(400).json({ error: "Post must have text or image" });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({
			user: userId,
			text,
			img,
		});

		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
		console.log("Error in createPost controller: ", error);
	}
};


export const deletePost = async (req,res) =>{
    try {
        const post = await Post.findById(req.params.id)
        if(!post) return res.status(404).json({error:"post not found"});

        if(post.user.toString() !== req.user._id.toString()) return res.status(401).json({error:"you are no authorized to delte this post"});

        if(post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId)
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Post delted succesfully"});
    } catch (error) {
        
    }
}

export const commentPost = async(req,res) =>{
    try {
        const {text} = req.body;
        const postId  = req.params.id;
        const userId = req.user._id;

        if(!text) return res.status(400).json({error:"this field is required"});

        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({error:"post not found"});

        const comment = {user: userId,text}

        post.comment.push(comment);
        await post.save();

        res.status(200).json(post)
    } catch (error) {
        console.log("error in commentpost controller", error);
        res.status(500).json({error:"internal server error"});
    }
}


export const likeunlikePost = async(req,res) =>{
    try {
        const userId = req.user._id;
        const {id:postId} = req.params;

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({error:"post not found"});

        const userlikedPost = post.likes.includes(userId);

        if(userlikedPost){
            await Post.updateOne({_id:postId},{$pull: {likes:userId}});
            await User.updateOne({_id: userId},{$pull:{likedPost: postId}});
            res.status(200).json({message:"post unliked succesfully"});
        }else{
            post.likes.push(userId);
            await User.updateOne({_id: userId},{$push: {likedPost: postId}});
            await post.save();

            const notification = new Notification({
                from:userId,
                to:post.user,
                type:"like"
            })

            await notification.save();
            res.status(200).json({message:"post liked succesfully"});
        }

    } catch (error) {
        console.log("error in likedunlikedPost",error.message);
        res.status(500).json({error:"internal server error"});
    }
}


export const getAllPost = async (req,res)=>{
    try {
        const  posts = await Post.find().sort({createdAt:-1}).populate({
            path:"user",
            select:"-password",
        }).populate({
            path:"comment.user",
            select:"-password",
        })
        if(posts.legth === 0 ) {
            return res.status(200).json([]);
        }
        res.status(200).json(posts);

    } catch (error) {
        console.log("error in getAllPost",error.message);
        res.status(500).json({error:"internal server error"});
    }
}


export const getlikedPost = async (req,res)=>{

    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({error:"user not found"});

        const likedPosts = await Post.find({_id:{$in: user.likedPost}})
        .populate({
            path:"user",
            select:"-password",
        }).populate({
            path:"comment.user",
            select:"-password",
        });

        res.status(200).json({likedPosts}) 

    } catch (error) {
        console.log("error in getlikedPost",error.message);
        res.status(500).json({error:"internal server error"});
    }
}

export const getFollowingPost = async (req,res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({error:"User not found"});

        const following = user.following
        const feedPost = await Post.find({user:{$in: following}})
        .sort({createdAt:-1})
        .populate({
            path:"user",
            select:"-password",            
        })
        .populate({
            path:"comment.user",
            select:"-password",            
        })


        res.status(200).json(feedPost);
    } catch (error) {
        console.log("error in getFollowingPost",error.message);
        res.status(500).json({error:"internal server error"});
    }
}

export const getUserPost = async (req,res)=>{
    try {
        const {username} =req.params;
        const  user = await User.findOne({username});
        if(!user) return res.status(404).json({error:"user not found"});

        const posts = await Post.find({user:user._id}).sort({createdAt:-1})
        .populate({
            path:"user",
            select:"-password",
        })
        .populate({
            path:"user",
            select:"-password",            
        })

        res.status(200).json(posts)
    } catch (error) {
        console.log("error in getUserPost:",error.message);
        res.status(500).json({error:"internal server error"});
    }
}