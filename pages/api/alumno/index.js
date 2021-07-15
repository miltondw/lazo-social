import connectDB from "../../../utils/connectDB";
import Alumnos from "../../../models/alumnoModel";
import auth from "../../../middlewares/auth";
connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getAlumnos(req, res);
      break;
    case "POST":
      await createAlumno(req, res);
      break;
  }
};
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString };

    const excludeFields = ["page", "sort", "limit"];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (queryObj.club !== "all") this.query.find({ club: queryObj.club });
    if (queryObj.firstName !== "all")
      this.query.find({ firstName: { $regex: queryObj.firstName } });

    this.query.find();

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join("");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 6;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const getAlumnos = async (req, res) => {
  try {
    const features = new APIfeatures(Alumnos.find(), req.query)
      .filtering()
      .sorting()
      .paginating();

    const alumnos = await features.query;

    res.json({
      status: "success",
      result: alumnos.length,
      alumnos,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
const createAlumno = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "La autenticación no es válida.." });

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
      !weight ||
      !size ||
      !sexo ||
      !observations ||
      images.length === 0
    )
      return res
        .status(400)
        .json({ err: "Por favor Agregue todos los campos" });

    const newAlumno = new Alumnos({
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
      sexo: sexo.toLowerCase(),
      exonerado,
      observations,
    });

    await newAlumno.save();

    res.json({ msg: "!Éxito! Creó un nuevo Alumno" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
