import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import CORS package
import testCaseRoutes from './routes/testcases.routes.js'
import userRoutes from "./routes/user.routes.js"
import problemRoutes from "./routes/problem.routes.js"
import runcodeRoutes from "./routes/runcode.routes.js"
import dotenv from 'dotenv'
import mongoose from 'mongoose';

const app = express();

dotenv.config()

// Enable CORS for all origins (you can restrict it to specific origins if needed)
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

app.use('/testcases', testCaseRoutes)
app.use("/user", userRoutes);
app.use("/problems", problemRoutes);
app.use("/runcode", runcodeRoutes);


mongoose.connect(process.env.URI).then(()=> {
  console.log("Connected successfully");
  app.listen(process.env.PORT || 8000, (error) => {
    if(error) console.log(err);
    console.log("Running Successfully at : " + process.env.PORT)
  });
}).catch((error) => {
  console.log("Error occurred : ", error);
})