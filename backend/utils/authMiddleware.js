const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "TOKEN NOT FOUND",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach the decoded user ID to the request body
    if (req.body) {
      req.body._id = decoded._id;
      req.body.email = decoded.email;
      req.body.name = decoded.name;
      req.body.verification = decoded.verification;
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "ACCESS_TOKEN IS TAMPERED",
      success: false,
    });
  }
};

module.exports = authMiddleware;
