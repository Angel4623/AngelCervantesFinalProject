const User = require("../model/User");
const bcrypt = require("bcrypt");

const handelLogin = async (req, res) => {
  const user = req.body.user;
  const pwd = req.body.password;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "UserName and password is required!" });
      
  //Check for duplicate username in the DB
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); //unauthorized
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    res.json({ success: `User ${user} is logged in!` });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handelLogin };