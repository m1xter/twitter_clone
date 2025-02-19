import express from "express";
import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import connectMongoDB from "./db/connectMongodb.js";
import cookieParser from "cookie-parser";


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDDINARY_API_KEY,
    api_secret: process.env.CLOUDDINARY_API_SECRET,
})

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`);
    connectMongoDB();
})