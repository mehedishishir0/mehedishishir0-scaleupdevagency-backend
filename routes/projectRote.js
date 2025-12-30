const express = require("express");
const projectRouter = express.Router();

const {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");


projectRouter.post("/", addProject);

projectRouter.get("/", getProjects);

projectRouter.get("/:id", getProjectById);

projectRouter.put("/:id", updateProject);

projectRouter.delete("/:id", deleteProject);

module.exports = projectRouter;
