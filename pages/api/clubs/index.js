import connectDB from "../../../utils/connectDB";
import Clubs from "../../../models/clubsModel";
import auth from "../../../middlewares/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createClub(req, res);
      break;
    case "GET":
      await getClubs(req, res);
      break;
  }
};
const createClub = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "La autenticación no es válida" });
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ err: "El nombre no puede dejarse en blanco." });
    const newClub = new Clubs({ name: name.toLowerCase() });
    await newClub.save();
    res.json({
      msg: "¡Éxito! Creó un nuevo Club.",
      newClub,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
const getClubs = async (req, res) => {
  try {
    const clubs = await Clubs.find();
    res.json({ clubs });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
