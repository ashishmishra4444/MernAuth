import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    //sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to MERN Auth App",
      text: `Hello ${name},\n\nWelcome to our MERN Auth Application! We're excited to have you on board. Your account has been successfully created with email id ${email}.\n\nBest regards,\nMERN Auth Team`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and Password are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//send verification OTP to user's email
export const sendVerifyOTP = async (req, res) => {
  try {
    // const { userId } = req.body;
    const { userId } = req; // getting userId from req object set by userAuth middleware its like req.userId
    const user = await userModel.findById(userId);

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOTP = otp;

    user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000; //24 hours
    await user.save();

    //send otp to user's email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Hello ${user.name},\n\nYour OTP for account verification is ${otp}. It is valid for 24 hours. Please use this OTP to verify your account.\n\nBest regards,\nMERN Auth Team`,
    };
    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ success: true, message: "Verification OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//verify user's email using OTP
export const verifyEmail = async (req, res) => {
  // const { userId, otp } = req.body;
  const { userId } = req; // getting userId from req object set by userAuth middleware its like req.userId
  const { otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (user.verifyOTP === "" || user.verifyOTP !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOTPExpireAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    user.isVerified = true;
    user.verifyOTP = "";
    user.verifyOTPExpireAt = 0;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "User is authenticated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//send reset OTP to user's email
export const sendResetOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOTP = otp;
    user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000; //15 minutes
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Hello ${user.name},\n\nYour OTP for password reset is ${otp}. It is valid for 15 minutes. Please use this OTP to reset your password.\n\nBest regards,\nMERN Auth Team`,
    };
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//reset user password using OTP
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (user.resetOTP === "" || user.resetOTP !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetOTPExpireAt < Date.now()) {
        return res
          .status(400)
          .json({ success: false, message: "OTP has expired" });
    }
    const hashedPassword= await bcrypt.hash(newPassword,10);
    user.password = hashedPassword;
    user.resetOTP = "";
    user.resetOTPExpireAt = 0;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password has been reset successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
