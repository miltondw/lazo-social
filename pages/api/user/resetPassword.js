import connectDB from "../../../utils/connectDB";
import auth from "../../../middlewares/auth";
import Users from "../../../models/userModel";
import bcrypt from "bcrypt";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await resetPassword(req, res);
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    await Users.findOneAndUpdate(
      { _id: result.id },
      { password: passwordHash }
    );
    res.json({ msg: "Updated Success!" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
