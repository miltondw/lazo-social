import { model, Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    root: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/daekebmip/image/upload/v1623266972/17004_tsdq7h.png",
    },
  },
  {
    timestamps: true,
  }
);

let Dataset = models.user || model("user", userSchema);

export default Dataset