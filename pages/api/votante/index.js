import connectDB from "../../../utils/connectDB";
import Votantes from "../../../models/votanteModel";
import auth from "../../../middlewares/auth";
connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getVotantes(req, res);
      break;
    case "POST":
      await createVotante(req, res);
      break;
  }
};

// class APIfeatures {
//   constructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//   }
//   filtering() {
//     const queryObj = { ...this.queryString };

//     const excludeFields = ["page", "sort", "limit"];
//     excludeFields.forEach((el) => delete queryObj[el]);

//     if (queryObj.club !== "all") this.query.find({ club: queryObj.club });
//     if (queryObj.firstName !== "all")
//       this.query.find({ firstName: { $regex: queryObj.firstName } });

//     this.query.find();

//     return this;
//   }

//   sorting() {
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(",").join("");
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort("-createdAt");
//     }

//     return this;
//   }

//   paginating() {
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 6;
//     const skip = (page - 1) * limit;
//     this.query = this.query.skip(skip).limit(limit);
//     return this;
//   }
// }

const getVotantes = async (req, res) => {
  try {
    // const features = new APIfeatures(Votantes.find(), req.query)
    //   .filtering()
    //   .sorting()
    //   .paginating();
    // const votantes = await features.query;
    const votantes = await Votantes.find();

    res.json({
      status: "success",
      result: votantes.length,
      votantes,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
const createVotante = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "La autenticación no es válida.." });

    let {
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
        .json({ err: "Por favor Agregue todos los campos" });

    if (images.length === 0) {
      images = [
        {
          public_id: "nextjs_media/vljjasiqanh4xd0xpatm",
          url: "https://res.cloudinary.com/daekebmip/image/upload/v1626368601/nextjs_media/vljjasiqanh4xd0xpatm.png",
        },
      ];
    }

    const newVotante = new Votantes({
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
    });

    await newVotante.save();

    res.json({ msg: "!Éxito! Creó un nuevo Votante" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
