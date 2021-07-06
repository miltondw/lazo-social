import { model, Schema, models } from "mongoose";
const ClubsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
let Dataset = models.clubs || model("clubs", ClubsSchema);

export default Dataset;
