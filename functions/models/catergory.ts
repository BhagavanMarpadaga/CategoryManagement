import mongoose from "mongoose";
import { ICategory } from "../types";

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Catergoy",
  },
  isRoot: {
    type: Boolean,
    optional: true,
  },
});

const Catergoy = mongoose.model("Category", categorySchema);
export default Catergoy;
