const { verifyToken } = require("../../lib/jwt");
const prisma = require("../../lib/prisma");
const CustomAPIError = require("./custom-error");

const verifyTokenUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(req.headers);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = verifyToken(token);
    const { id, username } = decodedToken;
    const CheckUser = prisma.users.findUnique({
      where: { username: username },
    });
    if (!CheckUser) {
      throw new CustomAPIError("Unauthorized", 401);
    }
    req.user = decodedToken; // Store user information in request object for later use
    next(); // Move to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = { verifyTokenUser };
