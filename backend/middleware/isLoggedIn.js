const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  let token = req.cookies.token; // First check cookies

  // If token not in cookies, check Authorization header
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization.split(" ");
    if (authHeader[0] === "Bearer" && authHeader[1]) {
      token = authHeader[1]; // Extract token from Bearer token
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized access. No token provided." });
  }

  // console.log("Received Token:", token);

  try {
    const verified = jwt.verify(token.trim(), process.env.JWT_SECRET);
    req.user = verified; // Attach decoded user to req.user
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const restrictToBusiness = (req, res, next) => {
  if (req.user.role !== "business") {
    return res.status(403).json({
      error: "Only businesses can perform this action! Sign Up first instead",
    });
  }
  next();
};

module.exports = { isLoggedIn, restrictToBusiness };
