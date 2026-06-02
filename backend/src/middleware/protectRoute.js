import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export default async function protectRoute(req, res, next) {
  try {
    
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Unauthorized - No token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

    if (!decoded) {
      return res.status(400).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal data error" });
  }
}
