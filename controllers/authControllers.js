import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../db/models/User.js";
import HttpError from "../helpers/HttpError.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is missing! Add it to the .env file.");
  process.exit(1);
}

export const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const { email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) throw HttpError(409, "Email in use");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) throw HttpError(401, "Email or password is wrong");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw HttpError(401, "Email or password is wrong");

    try {
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
      await user.update({ token });
      res.status(200).json({ token, user: { email: user.email, subscription: user.subscription } });
    } catch (error) {
      throw HttpError(500, "Error generating token");
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (!req.user) throw HttpError(401, "Not authorized");

    await req.user.update({ token: null });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) throw HttpError(401, "Not authorized");

    res.status(200).json({ email: req.user.email, subscription: req.user.subscription });
  } catch (error) {
    next(error);
  }
};
