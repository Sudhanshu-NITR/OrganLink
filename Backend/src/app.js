import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import axios from 'axios';

const app = express();

const url = `https://organlink.onrender.com`;
const interval = 30000;

function reloadWebsite() {
    axios.get(url)
    .then((response) => {
      console.log("website reloded");
    })
    .catch((error) => {
      console.error(`Error : ${error.message}`);
    });
}

setInterval(reloadWebsite, interval);


app.get("/", (req, res)=>{
    res.send("Hello & Welcome to OrganLink!!");
});


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
})) // to avoid cross origin requests

app.use(express.json({limit: "16kb"})); //we are setting a limit on how much json data one can send
app.use(express.urlencoded({extended:true, limit:"16kb"})); //encoding the url
app.use(express.static("public")) //to store files that we recieve, into our server
app.use(cookieParser()) // to keep cookies securely on the browser such that only the server can read and remove the,

//routes import
import hospitalRouter from './routes/hospital.routes.js';

//routes declaration
app.use("/api/v1/hospitals", hospitalRouter);

export { app } ;