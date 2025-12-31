const express = require("express");
const categoriRouter = express.Router();
const categoryController = require("../controllers/categoryController");
const { protected } = require("../middlewares/authMiddilewares");

categoriRouter.post("/", protected, categoryController.addCategory);
categoriRouter.get("/", categoryController.getCategories);
categoriRouter.get("/pagination", categoryController.getCategoriesWithPagination);
categoriRouter.get("/:id", protected, categoryController.getCategoryById);
categoriRouter.put("/:id", protected, categoryController.updateCategory);
categoriRouter.delete("/:id", protected, categoryController.deleteCategory);

module.exports = categoriRouter;
