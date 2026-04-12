//SRP
//DIP


const ProjectRepository = require("../repositories/ProjectRepository");
const AppError = require("../utils/AppError");

class ProjectService{

    //Create project
    async createProject(userId, projectData){
        const {title, description, stage, supportRequired} = projectData;

        if (!title || !description){
            throw new AppError("Title and description are required", 400);

        }

        const project = await ProjectRepository.create({
            title,
            description,
            stage: stage || "Ideation",
            supportRequired: supportRequired || [],
            owner: userId

        });

        return project;


    }

    //get active projects 
    async getAllActiveProjects(){
        return await ProjectRepository.findAllActive();
    }

    //get project using id
    async getProjectById(projectId){
        const project = await ProjectRepository.findById(projectId);

        if (!project){
            throw new AppError("Project not found", 404);
        }

        return project;

    }

    

    //Get projects by userid
    async getUserProjects(userId){
        return await ProjectRepository.findByOwner(userId);
    }

    //Get all users active projects
    async getUserActiveProjects(userId){
        return await ProjectRepository.findActiveByOwner(userId);
    }


    //get all users completed projects
    async getUserCompletedProjects(userId){
        return await ProjectRepository.findCompletedByOwner(userId);
    }

    //Add milstone to project Note this can only be done by the owner
    async addMilestone(projectId, userId, milestoneData){

        const {title, description} = milestoneData;

        if (!title){
            throw new AppError("Milestone title required", 400)
        }

        const project = await this.getProjectById(projectId);

        if (project.owner._id.toString() !== userId.toString()){
            throw new AppError("Only the project owner can add milestones", 403);
        }

        const milestone={
            title, 
            description: description || "",
            completedAt: new Date()
        };

        const updatedProject = await ProjectRepository.addMilestone(projectId, milestone);

        return updatedProject;

    }

    //mark project as complete note this can only be done by the owner
    async completeProject(projectId, userId){
        const project = await this.getProjectById(projectId);

        if (project.owner._id.toString() !== userId.toString()){
            throw new AppError("Only the project owner can mark the project as comppleted", 403);

        }

        if (project.status === "completed"){
            throw new AppError("Project is already completed", 400);

        }

        const updatedProject = await ProjectRepository.completeProject(projectId);

        return updatedProject;
    }

    //User requests to collaborate
    async requestToCollaborate(projectId, userId){

        const project = await this.getProjectById(projectId);

        const isAlreadyCollaborator = project.collaborators.some(
            collab => collab._id.toString() === userId.toString()
        );

        if (isAlreadyCollaborator){
            throw new AppError("You are already a collaborator on this project", 400);

        }

        if (project.owner._id.toString() === userId.toString()){

            throw new AppError("You are the owner of this project", 400);

        }

        const updateProject = await ProjectRepository.addCollaborator(projectId, userId);

        return updateProject;

    }

    //remove collaborator note this can only be done by the owner
    async removeCollaborator(projectId, userId, collaboratorId){
        const project = await this.getProjectById(projectId);

        if (project.owner._id.toString() !== userId.toString()){

            throw new AppError("Only the project owner can remove collaborators", 403);

        }

        const updatedProject = await ProjectRepository.removeCollaborator(projectId, collaboratorId);

        return updatedProject;

    }

    //Udate the project stage note this can only be done by the owner
    async updateProjectStage(projectId, userId, stage){
        const validStages = ["Ideation", "MVP", "Development", "Testing", "Launch", "Post-Launch"];

        if (!validStages.includes(stage)){
            throw new AppError(`Invalid stage. Must be one of: ${validStages.join(", ")}`, 400);

        }

        const project = await this.getProjectById(projectId);

        if (project.owner._id.toString() !== userId.toString()){
            throw new AppError("Only the project owner can update the stage", 403);

        }

        const updatedProject = await ProjectRepository.updateStage(projectId, stage);

        return updatedProject;
    }

    //delete a project note this can only be done by the owner
    async deleteProject(projectId, userId){
        const project = await this.getProjectById(projectId);

        if (project.owner._id.toString() !== userId.toString()){
            throw new AppError("Only the project owner can delete this project", 403);

        }

        await ProjectRepository.deleteProject(projectId);

        return {message: 'Project deleted Succesfully'};

    }

    //Search for projects by term
    async searchProjects(searchTerm){

        if (!searchTerm || searchTerm.trim().length < 2){
            throw new AppError("Search term must be at least 2 characters", 400);

        }

        return await ProjectRepository.searchProjects(searchTerm);

    }

    async getProjectsByStage(stage){

        const validStages = ["Ideation", "MVP", "Development", "Testing", "Launch", "Post-Launch"];

        if (!validStages.includes(stage)){
            throw new AppError(`Invalid stage. Must be one of: ${validStages.join(", ")}`, 400);

        }

        return await ProjectRepository.findByStage(stage);

    }

    //Get recent completed projects
    async getCelebrationWall(limit = 20){
        return await ProjectRepository.getGlobalCompletedProjects(limit);

    }

    //Get users stats
    async getUserStats(userId){
        const totalProjects = await ProjectRepository.countUserProjects(userId);
        const completedProjects = await ProjectRepository.countUserCompletedProjects(userId);

        return{
            totalProjects,
            completedProjects,
            inProgressProjects: totalProjects - completedProjects
        };
    }


}

module.exports = new ProjectService();