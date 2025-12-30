const express = require("express");
const categoriRouter = express.Router();
const categoryController = require("../controllers/categoryController");

categoriRouter.post("/", categoryController.addCategory);
categoriRouter.get("/", categoryController.getCategories);
categoriRouter.get("/:id", categoryController.getCategoryById);
categoriRouter.put("/:id", categoryController.updateCategory);
categoriRouter.delete("/:id", categoryController.deleteCategory);

module.exports = categoriRouter;
