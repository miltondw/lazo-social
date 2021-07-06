import { model, Schema, models, Types } from "mongoose";
const CategoriesSchema = new Schema(
  {
    name:{
        type:String,
        required:true,
        trim:true
    }
  },
  {
    timestamps: true,
  }
);
let Dataset = models.categories || model("categories", CategoriesSchema);

export default Dataset;
