import connectDB from "../../../utils/connectDB";
import Alumnos from "../../../models/alumnoModel";
import auth from "../../../middlewares/auth";
connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getAlumno(req, res);
      break;
    case "PUT":
      await updateAlumno(req, res);
      break;
    case "DELETE":
      await deleteAlumno(req, res);
      break;
  }
};

const getAlumno = async (req, res) => {
  try {
    const { id } = req.query;
    const alumno = await Alumnos.findById(id);

    if (!alumno) return res.status(400).json({ err: "Este alumno no existe." });

    res.json({
      alumno,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const updateAlumno = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin" || !result.root)
      return res.status(400).json({ err: "La autenticación no es válida." });
    const { id } = req.query;
    const {
      firstName,
      age,
      firstLastName,
      ci,
      dateOfBirth,
      images,
      club,
      phone,
      dateOfEntry,
      weight,
      size,
      sexo,
      exonerado,
      observations,
    } = req.body;

    if (
      !firstName ||
      !age ||
      !firstLastName ||
      !ci ||
      !dateOfBirth ||
      !club ||
      !phone ||
      !dateOfEntry ||
      !sexo ||
      images.length === 0
    )
      return res
        .status(400)
        .json({ err: "Por favor Agregue todos los campos." });
    const a = await Alumnos.findOneAndUpdate(
      { _id: id },
      {
        firstName: firstName.toLowerCase(),
        age,
        firstLastName: firstLastName.toLowerCase(),
        ci,
        dateOfBirth,
        images,
        club: club.toLowerCase(),
        phone,
        dateOfEntry,
        weight,
        size,
        exonerado,
        sexo: sexo.toLowerCase(),
        observations,
      }
    );
    console.log(a);
    res.json({ msg: "¡Éxito! Alumno Actualizado" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
const deleteAlumno = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "La autenticación no es válida." });
    const { id } = req.query;
    await Alumnos.findByIdAndDelete(id);
    res.json({ msg: "¡Éxito! Alumno Eliminado" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
