const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      messages: "Access denied!",
    });
  }
  try {
    const SECRRET_KEY = process.env.TOKEN_KEY;
    const verified = jwt.verify(token, SECRRET_KEY);

    req.user = verified;

    next();
  } catch (error) {
    return res.status(400).send({
      messages: "Invalid Token",
    });
  }
};
