//OwnerRoutes 

const express = require("express");
const router = express.Router();
const projectController = require("../../controllers/projectController");

router.get("/projects", projectController.getMyProjects);
router.get("/projects/active", projectController.getMyActiveProjects);
router.get("/projects/completed", projectController.getMyCompletedProjects);
router.get("/stats", projectController.getUserStats);


module.exports = router;
