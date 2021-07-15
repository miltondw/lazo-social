import { model, Schema, models } from "mongoose";

const alumnoSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    firstLastName: {
      type: String,
      required: true,
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
      required: true,
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
  },
  {
    timestamps: true,
  }
);

let Dataset = models.alumno || model("alumno", alumnoSchema);

export default Dataset;
