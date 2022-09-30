const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (token) {
    jwt.verify(token, process.env.jwt, (err, user) => {
      if (err) {
        return res.status(403).json("invalid Token");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(500).json("Your are unauthenticated");
  }
};

const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.params.id === req.user.id || req.user.isAdmin) {
      next();
    } else {
      res.status(500).json("You are unauthenticated");
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(500).json("You are unauthenticated");
    }
  });
};

module.exports = { verifyUser, verifyAdmin };
