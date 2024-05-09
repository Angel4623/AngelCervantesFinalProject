const express = require("express");
const router = express();
const authController = require("../controllers/authController");

router.post("/", registerController.handelNewUser);

module.exports = router;