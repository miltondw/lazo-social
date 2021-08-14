import connectDB from "../../../utils/connectDB";
import Votantes from "../../../models/votanteModel";
import auth from "../../../middlewares/auth";
connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getVotante(req, res);
      break;
    case "PUT":
      await updateVotante(req, res);
      break;
    case "DELETE":
      await deleteVotante(req, res);
      break;
  }
};

const getVotante = async (req, res) => {
  try {
    const { id } = req.query;
    const votante = await Votantes.findById(id);

    if (!votante)
      return res.status(400).json({ err: "Este votante no existe." });

    res.json({
      votante,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const updateVotante = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin" || !result.root)
      return res.status(400).json({ err: "La autenticación no es válida." });
    const { id } = req.query;
    const {
      firstName,
      secondName,
      age,
      firstLastName,
      secondLastName,
      cc,
      dateOfBirth,
      images,
      club,
      phone,
      dateOfEntry,
      sexo,
      observations,
    } = req.body;

    if (!firstName || !age || !firstLastName)
      return res
        .status(400)
        .json({ err: "Por favor Agregue todos los campos." });
    const a = await Votantes.findOneAndUpdate(
      { _id: id },
      {
        firstName: firstName.toLowerCase(),
        secondName: secondName.toLowerCase(),
        age,
        firstLastName: firstLastName.toLowerCase(),
        secondLastName: secondLastName.toLowerCase(),
        cc,
        dateOfBirth,
        images,
        club: club.toLowerCase(),
        phone,
        dateOfEntry,
        sexo: sexo.toLowerCase(),
        observations,
      }
    );

    res.json({ msg: "¡Éxito! Votante Actualizado" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
const deleteVotante = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "La autenticación no es válida." });
    const { id } = req.query;
    await Votantes.findByIdAndDelete(id);
    res.json({ msg: "¡Éxito! Votante Eliminado" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
