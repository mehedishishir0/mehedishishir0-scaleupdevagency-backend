const express = require("express");
const profileRouter = express.Router();
const profileController = require("../controllers/profileController");

profileRouter.post("/", profileController.addProfile);
profileRouter.get("/", profileController.getProfiles);
profileRouter.get("/pagination", profileController.getProfilesWithPagination);
profileRouter.get("/:id", profileController.getProfileById);
profileRouter.put("/:id", profileController.updateProfile);
profileRouter.delete("/:id", profileController.deleteProfile);

module.exports = profileRouter;
