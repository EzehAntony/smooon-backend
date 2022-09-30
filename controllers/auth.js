const bcryptjs = require("bcryptjs");
const Users = require("../models/Users");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const name = await Users.findOne({ username: req.body.username });
  if (!name) {
    try {
      const salt = bcryptjs.genSaltSync(10);
      const hash = bcryptjs.hashSync(req.body.password, salt);

      const newUser = new Users({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        gender: req.body.gender,
        state: req.body.state,
        dob: req.body.dob,
        password: hash,
      });

      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    return res.status(401).json("Username already exits");
  }
};

const login = async (req, res) => {
  try {
    const oneUser = await Users.findOne({ username: req.body.username });
    if (!oneUser) {
      return res.status(403).json("Username does not exist");
    }

    const isPassword = await bcryptjs.compare(
      req.body.password,
      oneUser.password
    );

    if (!isPassword) {
      return res.status(500).json("Password is incorrect");
    }

    const token = jwt.sign(
      {
        id: oneUser._id,
        isAdmin: oneUser.isAdmin,
      },
      process.env.jwt
    );

    const { password, ...others } = oneUser._doc;
    res
      .cookie("access_token", token, {
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({ ...others });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { register, login };
