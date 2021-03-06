package com.netcracker.edu.tms.dao;

import com.netcracker.edu.tms.model.Project;
import com.netcracker.edu.tms.model.Task;
import com.netcracker.edu.tms.model.User;
import com.netcracker.edu.tms.model.UsersToProjects;

import java.math.BigInteger;
import java.util.List;

public interface ProjectDao {

    /**
     * Select project from DB by specified id
     *
     * @param projectId Project Id to return entire project
     * @return {@link Project} or null
     */
    Project getProjectById(BigInteger projectId);

    /**
     * Select project by name
     *
     * @param name
     * @return {@link Project} or null
     */
    Project getProjectByName(String name);

    /**
     * Add new project to database
     *
     * @param project
     * @return true or false depending on operation result
     */
    boolean addProject(Project project);

    /**
     * update existent project in database
     *
     * @param project
     * @param updatedProjectId
     * @return true or false depending on operation result
     */
    boolean updateProject(Project project, BigInteger updatedProjectId);

    /**
     * delete project from database
     *
     * @param projectId
     * @return true or false depending on operation result
     */

    boolean deleteProject(BigInteger projectId);

    /**
     * Select list of projects from DB by specified creatorId
     *
     * @param creatorId
     * @return list of {@link Project} or empty list
     */
    List<Project> findProjectsByCreatorId(BigInteger creatorId);

    /**
     * Select all projects from DB
     *
     * @return list of {@link Project} or empty list
     */
    List<Project> getAllProjects();

    /**
     *
     */
    List<Project> getProjectsByUserId(BigInteger userId);

    /**
     *
     */
    List<Task> getTasksByUserId(BigInteger userId);

    /**
     *
     */
    List<User> getTeamByProjectId(BigInteger projectId);

    /**
     *
     */
    boolean addUsersToProjects(UsersToProjects toAdd);

    /**
     *
     */
    boolean deleteUserFromTeam(User userToDelete, BigInteger projectId);

}