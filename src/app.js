import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit: "16kb"})); //we are configuring express app that we accept json
app.use(express.urlencoded({extended:true, limit:"16kb"})); //encoding the url
app.use(express.static("public")) //to store files that we recieve, into our server
app.use(cookieParser())

export { app } ;