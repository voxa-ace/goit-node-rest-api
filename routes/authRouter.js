import express from "express";
import { register, login, logout, getCurrentUser, updateAvatar } from "../controllers/authControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/current", authMiddleware, getCurrentUser);
authRouter.patch("/avatars", authMiddleware, upload.single("avatar"), updateAvatar);

export default authRouter;
