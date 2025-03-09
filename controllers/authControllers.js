import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import User from "../db/models/User.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;
const avatarsDir = path.join("public", "avatars");

if (!JWT_SECRET) {
  console.error("JWT_SECRET is missing! Add it to the .env file.");
  process.exit(1);
}

// User registration
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) throw HttpError(409, "Email in use");

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);

    const newUser = await User.create({ email, password: hashedPassword, avatarURL });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

// User login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) throw HttpError(401, "Email or password is wrong");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw HttpError(401, "Email or password is wrong");

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    await user.update({ token });

    res.status(200).json({
      token,
      user: { email: user.email, subscription: user.subscription, avatarURL: user.avatarURL },
    });
  } catch (error) {
    next(error);
  }
};

// User logout
export const logout = async (req, res, next) => {
  try {
    if (!req.user) throw HttpError(401, "Not authorized");

    await req.user.update({ token: null });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) throw HttpError(401, "Not authorized");

    res.status(200).json({
      email: req.user.email,
      subscription: req.user.subscription,
      avatarURL: req.user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

// Update avatar
export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw HttpError(400, "File not provided");

    const { path: tempPath, filename } = req.file;
    const fileExtension = path.extname(filename);
    const uniqueFilename = `${req.user.id}-${Date.now()}${fileExtension}`;
    const newPath = path.join(avatarsDir, uniqueFilename);

    // Delete old avatar if exists
    if (req.user.avatarURL) {
      const oldAvatarPath = path.join(avatarsDir, path.basename(req.user.avatarURL));
      try {
        await fs.unlink(oldAvatarPath);
      } catch (err) {
        console.warn("Old avatar not found or already deleted.");
      }
    }

    // Move new avatar to the avatars directory
    await fs.rename(tempPath, newPath);

    const avatarURL = `/avatars/${uniqueFilename}`;
    await req.user.update({ avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
