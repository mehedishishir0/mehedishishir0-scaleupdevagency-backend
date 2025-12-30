const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    figmaLink: { type: String },
    websiteLink: { type: String },
    adminLink: { type: String },
    category: { type: String, required: true },
  },
  { timestamps: true }
);



const ProjectModel = mongoose.model("Project", ProjectSchema);
module.exports = ProjectModel