import { model, Schema, models } from "mongoose";

const alumnoSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    secondName: {
      type: String,
      trim: true,
    },
    firstLastName: {
      type: String,
      required: true,
      trim: true,
    },
    secondLastName: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
    },
    cc: {
      type: Number,
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    images: {
      type: Array,
    },
    club: {
      type: String,
      default: "all",
    },
    phone: {
      type: Number,
      required: true,
    },
    dateOfEntry: {
      type: Date,
    },
    weight: {
      type: Number,
    },
    size: {
      type: Number,
    },
    sexo: {
      type: String,
    },
    exonerado: {
      type: Boolean,
      default: false,
    },
    observations: {
      type: String,
      trim: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    nameFather: {
      type: String,
      trim: true,
    },
    lastNameFather: {
      type: String,
      trim: true,
    },
    secondNameFather: {
      type: String,
      trim: true,
    },
    secondLastNameFather: {
      type: String,
      trim: true,
    },
    nameMother: {
      type: String,
      trim: true,
    },
    lastNameMother: {
      type: String,
      trim: true,
    },
    secondNameMother: {
      type: String,
      trim: true,
    },
    secondLastNameMother: {
      type: String,
      trim: true,
    },
    phoneFather: {
      type: Number,
    },
    phoneMother: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

let Dataset = models.alumno || model("alumno", alumnoSchema);

export default Dataset;
