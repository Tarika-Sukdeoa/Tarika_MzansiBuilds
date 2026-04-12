//ProjectRoutes

const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/auth");


const projectPublicRoutes = require("./project/publicRoutes");
const projectOwnerRoutes = require("./project/ownerRoutes");
const projectEditRoutes = require("./project/editProjectRoutes");
const authService = require("../services/authService");

router.delete("/:id/delete", authMiddleware.protect, projectController.deleteProject);
router.use("/", projectPublicRoutes);
router.use("/my", authMiddleware.protect, projectOwnerRoutes);
router.use("/:id/edit", authMiddleware.protect, projectEditRoutes);
router.post("/:id/collaborate", authMiddleware.protect, projectController.requestCollaboration);

router.post("/", authMiddleware.protect, projectController.createProject);

module.exports = router;
