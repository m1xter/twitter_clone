import express from "express";
import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from  "./routes/postRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import connectMongoDB from "./db/connectMongodb.js";
import cookieParser from "cookie-parser";
import path from "path"

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDDINARY_API_KEY,
    api_secret: process.env.CLOUDDINARY_API_SECRET,
})

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve()
app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/notification",notificationRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/Frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
	});
}

app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`);
    connectMongoDB();
})