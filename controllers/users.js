const Users = require("../models/Users");
const bcryptjs = require("bcryptjs");

/* Update */
const updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = bcryptjs.genSaltSync(10);
      const hash = bcryptjs.hashSync(req.body.password, salt);

      const updatedUser = await Users.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            password: hash,
            gender: req.body.gender,
            interest: req.body.interest,
            state: req.body.state,
          },
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } else {
      const updatedUser = await Users.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

/* Delete */
const deleteUser = async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.params.id);
    res.cookie("access_token", "Deleted User has no access");
    res
      .status(200)
      .json(
        "User has been deleted from the database and no longer has access to the website."
      );
  } catch (err) {
    res.status(500).json(err);
  }
};

/* Get single */
const oneUser = async (req, res) => {
  try {
    const oneUser = await Users.findById(req.body.userId);
    const { password, isAdmin, ...others } = oneUser._doc;
    res.status(200).json({ ...others });
  } catch (err) {
    res.status(500).json(err);
  }
};

/* Get All */
const allUsers = async (req, res) => {
  try {
    const oneUser = await Users.find();
    res.status(200).json(oneUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

const likeUser = async (req, res) => {
  try {
    const currentUser = await Users.findById(req.params.id);
    const otherUser = await Users.findOne({ _id: req.body.userId });

    if (!currentUser.liked.includes(otherUser._id)) {
      await currentUser.updateOne({
        $push: { liked: otherUser._id },
      });
      res.status(200).json("User has been added to Liked");
    } else {
      await currentUser.updateOne({
        $pull: { liked: otherUser._id },
      });
    }
  } catch (err) {
    res.status(500).json(error);
  }
};

module.exports = {
  updateUser,
  deleteUser,
  oneUser,
  allUsers,
  likeUser,
};
