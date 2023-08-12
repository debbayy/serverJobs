const express = require("express");

const router = express.Router();

const { auth } = require("../middlewares/auth");

//requere user

//auth
const { register, login } = require("../controller/login");
router.post("/register", register);
router.post("/login", login);

const { getJobs, getJobDetail } = require("../controller/services");
router.get("/jobs", auth, getJobs);
router.get("/job/:id", auth, getJobDetail);

module.exports = router;
