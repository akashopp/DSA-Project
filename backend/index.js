import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/user.routes.js"
import problemRoutes from "./routes/problem.routes.js"

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use("/problems", problemRoutes);

dotenv.config();

mongoose.connect(process.env.URI).then(()=> {
  
  console.log("Connected successfully");

  app.listen(process.env.PORT || 8000, (error) => {
    if(error) console.log(err);
    console.log("Running Successfully at : " + process.env.PORT)
  });
  
}).catch((error) => {
  
  console.log("Error occurred : ", error);
  
})