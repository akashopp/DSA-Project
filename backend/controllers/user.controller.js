import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const CreateUser = async(req, res) => {

  try {
    
    const {name, userId, email, phoneNumber, password, problemId} = req.body;

    const flag = await User.findOne({userId: userId});

    if(flag) {
      return res.status(400).json({
        message: "User already exist",
        success: false
      })
    }

    await User.create({
      name,
      userId,
      email,
      phoneNumber,
      password,
      problemId
    })

    return res.status(200).json({
      message: "User added successfully",
      success: true
    })
    
  } catch (error) {
    console.log(error);
  }

}

export const getUser = async(req, res) => {
  try {
    const items = await User.find();

    return res.status(200).json({
      items
    })
    
  } catch (error) {
    console.log(error);
  }
}

export const getUserSolved = async(req, res) => {
  try {
    const userId = await req.params.id;

    const user = await User.findById(userId);

    if(!user) {
      return res.status(400).json({
        "message" : "User not found",
        "success": false
      })
    }

    return res.status(200).json({
      "problems" : user.problemId
    })

  } catch (error) {
    console.log(error);
  }
}

export const AddProblem = async(req, res) => {

  try {
    
    const {userId, problemId} = req.body;

    if(!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(200).json({
        message : "User doesn't exist"
      })
    }

    const user = await User.findById(userId);
    
    if(user.problemId.includes(problemId)) {
      return res.status(400).json({
        message: "Problem already solved"
      })
    }

    user.problemId.push(problemId);
    await user.save();
  
    return res.status(200).json({
      "message" : "User exist",
      "problem": user.problemId
    })
    
  } catch (error) {
    console.log(error);
  }

}


export const DeleteProblem = async(req, res) => {

  try {
    
    const {userId, problemId} = req.body;
    
    if(!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(200).json({
        message : "User doesn't exist"
      })
    }
    
    const user = await User.findOne({_id : userId});

    if(!user.problemId.includes(problemId)) {
      return res.status(400).json({
        message: "Problem didn't solved"
      })
    }

    user.problemId = user.problemId.filter(problem => problem != problemId);
    await user.save();
  
    return res.status(200).json({
      message : "Problem deleted successfully",
      success: true
    })
    
  } catch (error) {
    console.log(error);
  }

}