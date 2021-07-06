import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";
import jwt from "jsonwebtoken";
import { createAccessToken } from "../../../utils/generateToken";

connectDB();

export default async (req, res) => {
  try {
    const rf_token = req.cookies.refreshtoken;
    if (!rf_token) return res.status(400).json({ err: "¡Por Favor Inicia sesión ahora!" });

    const result = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET);
    if (!result)
      return res
        .status(400)
        .json({ err: "Tu token es incorrecto o ha caducado." });

    const user = await Users.findById(result.id);
    if (!user) return res.status(400).json({ err: "El usuario no existe" });

    const access_token = createAccessToken({ id: user._id });

    res.json({
      access_token,
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
