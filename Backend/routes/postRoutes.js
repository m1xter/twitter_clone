import express from "express";
import { protectRoute } from "../middleware/proctecRoute.js";
import { createPost } from "../controllers/post.controller.js";
import { deletePost } from "../controllers/post.controller.js";
import { commentPost } from "../controllers/post.controller.js";
import { likeunlikePost } from "../controllers/post.controller.js";
import { getAllPost } from "../controllers/post.controller.js";
import { getlikedPost } from "../controllers/post.controller.js";
import { getFollowingPost } from "../controllers/post.controller.js";
import { getUserPost } from "../controllers/post.controller.js";
const router = express.Router();

router.get("/all",protectRoute,getAllPost);
router.get("/following",protectRoute,getFollowingPost);
router.get("/likes/:id",protectRoute,getlikedPost);
router.get("/user/:username",protectRoute,getUserPost);
router.post("/create",protectRoute,createPost);
router.post("/like/:id",protectRoute,likeunlikePost);
router.post("/comment/:id",protectRoute,commentPost);
router.delete("/:id",protectRoute,deletePost);

export default router;