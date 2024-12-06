import { User } from "../models/user.model.js";

export const CreateUser = async(req, res) => {

  try {
    
    const {name, userId, email, phoneNumber, password} = req.body;

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
      password
    })

    return res.status(200).json({
      message: "User added successfully",
      success: true
    })
    
  } catch (error) {
    console.log(error);
  }

}

export const AddProblem = async(req, res) => {

  try {
    
    const {userId, problemId} = req.body;

    const flag = await User.findOne({userId: userId, problemId: problemId});

    if(flag) {
      return res.status(400).json({
        message: "Problem already solved by user",
        success: false
      })
    }

    await User.create({
      
    })

    return res.status(200).json({
      message: "User added successfully",
      success: true
    })
    
  } catch (error) {
    console.log(error);
  }

}