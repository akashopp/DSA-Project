import express from "express";
// import { CreateUser, getUser, findUser } from "../controllers/user.controller.js";

import { CreateUser, getUser, getUserSolved, AddProblem, DeleteProblem } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/register").post(CreateUser);
router.route("/getuser").get(getUser);
router.route("/getproblems/:id").get(getUserSolved)
router.route("/addproblem").put(AddProblem)
router.route("/deleteproblem").put(DeleteProblem)

// router.route("/getuser").get(getUser);
// router.route("/delete/:id").delete(deleteUser);
// router.route("/finduser").post(findUser);

// router.route("/addproblem").https://github.com/akashopp/DSA-Project.gitpost(AddProblem);

export default router;