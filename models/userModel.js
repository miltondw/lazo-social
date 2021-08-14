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
        "https://res.cloudinary.com/didbvasyi/image/upload/v1628961986/lazo_politico/perfil-default_uadmbb.png",
    },
  },
  {
    timestamps: true,
  }
);

let Dataset = models.user || model("user", userSchema);

export default Dataset