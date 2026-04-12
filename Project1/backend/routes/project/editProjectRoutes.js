//editProjectRoutes

const express = require("express");
const projectController = require("../../controllers/projectController");
const router = express.Router({mergeParams: true});

router.post("/milestones", projectController.addMilestone);
router.patch("/complete", projectController.completeProject);
router.delete("/collaborators/:userId", projectController.removeCollaborator);
router.patch("/stage", projectController.updateProjectStage);
router.delete("/", projectController.deleteProject);


module.exports = router;