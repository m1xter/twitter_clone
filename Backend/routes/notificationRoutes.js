import express from "express"
import { protectRoute } from "../middleware/proctecRoute.js";
import { getNotifications,delelteNotifications} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/",protectRoute,getNotifications);
router.delete("/",protectRoute,delelteNotifications);
//router.delete("/:id",protectRoute,delelteNotification);

export default router;