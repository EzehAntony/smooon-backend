const router = require("express").Router();
const {
  updateUser,
  deleteUser,
  oneUser,
  allUsers,
  likeUser,
} = require("../controllers/users");

const { verifyUser, verifyAdmin } = require("../utils/verifyToken");

router.put("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteUser);
router.post("/get/:id", verifyUser, oneUser);
router.get("/all/:id", verifyUser, allUsers);
router.put("/like/:id", verifyUser, likeUser);

module.exports = router;
