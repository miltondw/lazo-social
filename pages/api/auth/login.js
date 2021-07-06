import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";
import bcrypt from "bcrypt";
import {
  createAccessToken,
  createrefreshToken,
} from "../../../utils/generateToken";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await login(req, res);
      break;
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user)
      return res.status(400).json({ err: "Este usuario no existe." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ err: "Contraseña incorrecta." });

    const access_token = createAccessToken({ id: user._id });
    const refresh_token = createrefreshToken({ id: user._id });

    res.json({
      msg: "Inicio de sesión exitosa!",
      access_token,
      refresh_token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        root: user.root,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
