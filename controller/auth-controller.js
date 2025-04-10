import bcrypt from "bcryptjs";
import { User } from "../models/user-model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const SignUp = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "all field require" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ msg: "email already exist" });
  }
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ msg: "user successfully created" });
  } catch (error) {
    console.log("error while creating user", error);
    next(error);
  }
};

export const SignIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(errorHandler(404, "all fields are required"));

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "user does not exist"));

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "wrong credentials"));

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_TOKEN,
      { expiresIn: "24h" }
    );
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ token, user: rest });
  } catch (error) {
    next(error);
  }
};

export const SignOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("successfully logout");
  } catch (error) {
    next(error);
  }
};
