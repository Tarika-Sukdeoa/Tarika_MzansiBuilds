//SRP
//Depends on ProjectService abstraction


const ProjectService = require("../services/projectService");
const AppError = require("../utils/AppError");

class ProjectController{

    async createProject(req, res, next){

        try{
        const userId = req.user._id;
        const project = await ProjectService.createProject(userId, req.body);
        
        res.status(201).json({
            success: true,
            message: "Project created succesfully",
            data: project

        });

    }catch(error){
        next(error);
    }
    
    }

    async getAllActiveProjects(req, res, next){
        try{
            const projects = await ProjectService.getAllActiveProjects();

            res.status(200).json({
                success: true,
                count: projects.length,
                data: projects
            });
    
        }catch(error){
            next(error);
        }
    }

    async getProjectById(req, res, next){
        try{
            const {id} = req.params;
            const project = await ProjectService.getProjectById(id);

            res.status(200).json({
                success: true,
                data: project
            });
        }catch(error){
            next(error);
        }
    }

    async getMyProjects(req, res, next){
        try{
            const userId = req.user._id;
            const projects = await ProjectService.getUserProjects(userId);

            res.status(200).json({
                success: true,
                count: projects.length,
                data: projects
            });
        }catch(error){
            next(error);
        }

    
    }

    async getMyActiveProjects(req, res, next){

        try{
            const userId = req.user._id;
            const projects = await ProjectService.getUserActiveProjects(userId);

            res.status(200).json({
                success: true,
                count: projects.length,
                data: projects
            });
        }catch(error){
            next(error);
        }

    }

    async getMyCompletedProjects(req, res, next){

        try{
        const userId = req.user._id;
        const projects = await ProjectService.getUserCompletedProjects(userId);

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
        }catch(error){
            next(error);

        }

    }

    async addMilestone(req, res, next){

        try{
            const {id} = req.params;
            const userId = req.user._id;
            const milestone = await ProjectService.addMilestone(id, userId, req.body);

            res.status(200).json({
                success: true,
                message: "Milestone added successfully",
                data: milestone
            });
        }catch(error){
            next(error);
        }

    }

    async completeProject(req, res, next){
        try{

            const {id} = req.params;
            const userId = req.user._id;
            const project = await ProjectService.completeProject(id, userId);

            res.status(200).json({
                success: true,
                message: "Project marked as complete",
                data: project
            });

        }catch(error){
            next(error);
        }
        
    }

    async requestCollaboration(req, res, next){
        try{
            const {id} = req.params;
            const userId = req.user._id;
            const project = await ProjectService.requestToCollaborate(id, userId);

            res.status(200).json({
                success: true,
                message: "Collaboration request sent successfully",
                data: project
            });
        }catch(error){
            next(error);
        }
    }

    async removeCollaborator(req, res, next){
        try{
            const {id, userId} = req.params;
            const currentUserId = req.user._id;
            const project = await ProjectService.removeCollaborator(id, currentUserId, userId);

            res.status(200).json({
                success: true,
                message: "Collaborator removed successfully",
                data: project
            });
        }catch(error){
            next(error);
        }
    }

    async getGlobalCompleted(req, res, next){

         try{
            const projects = await ProjectService.getGlobalCompleted();

            res.status(200).json({
                success: true,
                count: projects.length,
                data: projects
            });
    
        }catch(error){
            next(error);
        }


    }

    async updateProjectStage(req, res, next){
        try{
            const {id} = req.params;
            const userId = req.user._id;
            const {stage} = req.body;

            if(!stage){
                throw new AppError("Stage is required", 400);
            }

            const project = await ProjectService.updateProjectStage(id, userId, stage);

            res.status(200).json({
                success: true,
                message: "Project stage updated successfully",
                data: project
            });

        }catch(error){
            next(error);
        }
    }

    async deleteProject(req, res, next){
        try{
            const {id} = req.params;
            const userId = req.user._id;

            const result = await ProjectService.deleteProject(id, userId);

            res.status(200).json({
                success: true,
                message: result.message
            });
        }catch(error){
            next(error);
        }
    }

    async searchProjects(req, res, next){
        try{
            const {q} = req.query;

            if(!q){
                return res.status(400).json({
                    success: false,
                    message: "Search query paramter 'q' is required"
                });
            }

            const projects = await ProjectService.searchProjects(q);

            res.status(200).json({
                success: true,
                count: projects.length,
                query: q,
                data: projects
            });
        }catch(error){
            next(error);
        }
        
    }

    async getProjectByStage(req, res, next){
        try{
            const{stage} = req.params;
            const projects = await ProjectService.getProjectsByStage(stage);

            res.status(200).json({
                success: true,
                count: projects.length,
                stage: stage,
                data: projects
            });
        }catch(error){
            next(error);
        }
    }

    async getCelebrationWall(req, res, next){

        try{
            const limit = parseInt(req.query.limit) || 20;
            const projects = await ProjectService.getCelebrationWall(limit);

            res.status(200).json({
                success: true,
                count: projects.length,
                data: projects
            });
        }catch(error){
            next(error);
        }

    }

    async getUserStats(req, res, next){
        try{
            const userId = req.user._id;
            const stats = await ProjectService.getUserStats(userId);

            res.status(200).json({
                success: true,
                data: stats
            });
        }catch(error){
            next(error);
        }
    }

    



};

module.exports = new ProjectController();