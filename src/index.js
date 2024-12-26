import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({
    path: './env'
});

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on ${process.env.PORT}`)
    })
    app.on("error", (error)=>{
        console.log("ERRR: ", error);
        throw error;
    }) //To handle errors when DB got connected but the express app is not able to communicate with it
})
.catch((error)=>{
    console.log("MONGODB Connection failed!! ",error);
    throw error;
})








/*
const app = express();

( async () =>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (error)=>{
            console.log("ERRR: ", error);
            throw error;
        }) //So as to handle errors that occur during database connection

        app.listen(process.env.PORT, ()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("ERROR: ",error)
        throw error;
    }
})()

*/