import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    // const { userId } = req.body;
    const { userId } = req; // getting userId from req object set by userAuth middleware its like req.userId
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        userData: {
          name: user.name,
          isVerified: user.isVerified,
        },
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
