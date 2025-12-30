const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String }, // optional
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = CategoryModel;
