import { model, Schema, models } from "mongoose";

const votanteSchema = new Schema(
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
    }
  },
  {
    timestamps: true,
  }
);

let Dataset = models.votante || model("votante", votanteSchema);

export default Dataset;
