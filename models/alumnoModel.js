import { model, Schema, models } from "mongoose";

const alumnoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: Number,
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
    clubs: {
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
    oservations: {
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
