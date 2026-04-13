//Public routes

const express = require("express");
const router = express.Router();
const projectController = require("../../controllers/projectController");

//Public routes

router.get("/", projectController.getAllActiveProjects);
router.get("/completed", projectController.getGlobalCompleted);
router.get("/search", projectController.searchProjects);
router.get("/celebrations", projectController.getCelebrationWall);
router.get("/stage/:stage", projectController.getProjectByStage);
router.get("/:id", projectController.getProjectById);

module.exports = router;
