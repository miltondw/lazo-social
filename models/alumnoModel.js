import { model, Schema, models } from "mongoose";

const alumnoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
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
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    sexo: {
      type: String,
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
