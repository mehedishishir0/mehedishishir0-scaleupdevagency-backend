const express = require("express");
const profileRouter = express.Router();
const profileController = require("../controllers/profileController");
const { protected } = require("../middlewares/authMiddilewares");

profileRouter.post("/", protected, profileController.addProfile);
profileRouter.get("/", profileController.getProfiles);
profileRouter.get("/pagination", profileController.getProfilesWithPagination);
profileRouter.get("/:id", profileController.getProfileById);
profileRouter.put("/:id", protected, profileController.updateProfile);
profileRouter.delete("/:id", protected, profileController.deleteProfile);

module.exports = profileRouter;
