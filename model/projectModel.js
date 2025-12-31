const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    figmaLink: { type: String },
    websiteLink: { type: String },
    adminLink: { type: String },
    type:{
      type: String,
      enum: ["web", "app"],
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true
    },
    orderId: { type: String, required: true },
  },
  { timestamps: true }
);

const ProjectModel = mongoose.model("Project", ProjectSchema);
module.exports = ProjectModel;