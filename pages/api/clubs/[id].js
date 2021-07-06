import connectDB from "../../../utils/connectDB";
import Clubs from "../../../models/clubsModel";
import Alumnos from "../../../models/alumnoModel"; 
import auth from "../../../middlewares/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await updateCategory(req, res);
      break;
    case "DELETE":
      await deleteCategory(req, res);
      break;
  }
};

const updateCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "La autenticación no es válida" });
    const { name } = req.body;
    const { id } = req.query;
    const newCategory = await Clubs.findOneAndUpdate(
      { _id: id },
      { name }
    );
    res.json({
      msg: "¡Éxito! Al actualizar una nuevo Club",
      clubs: { ...newCategory._doc, name },
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "La autenticación no es válida" });
    const { id } = req.query;
    const alumnos = await Alumnos.findOne({ clubs: id });
    if (alumnos)
      return res.status(400).json({
        err: "Elimine o edite todos los Alumnos con una relación",
      });

    await Clubs.findByIdAndDelete(id);
    res.json({ msg: "¡Éxito! Club eliminado" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
