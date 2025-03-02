import jwt from "jsonwebtoken";
import User from "../db/models/User.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
  try {
    console.log("Перевіряємо авторизацію...");
    
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    console.log("Authorization Header:", authorization);
    console.log("Bearer:", bearer);
    console.log("Token:", token);

    if (bearer !== "Bearer" || !token) {
      console.log("Token not found or wrong format");
      throw HttpError(401, "Not authorized");
    }

    const { id } = jwt.verify(token, JWT_SECRET);
    console.log("🔹 Decoded User ID:", id);

    const user = await User.findByPk(id);
    console.log("Found User:", user ? user.email : "Not found");

    if (!user || user.token !== token) {
      console.log("User not found or token mismatch");
      throw HttpError(401, "Not authorized");
    }

    console.log("Authorization successful");
    req.user = user;
    next();
  } catch (error) {
    console.log("Authorization error:", error.message);
    next(HttpError(401, "Not authorized"));
  }
};

export default authMiddleware;
