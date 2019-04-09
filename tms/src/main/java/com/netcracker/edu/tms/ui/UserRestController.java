package com.netcracker.edu.tms.ui;

import com.netcracker.edu.tms.model.DeletedUserFromTeam;
import com.netcracker.edu.tms.model.Project;
import com.netcracker.edu.tms.model.Task;
import com.netcracker.edu.tms.model.User;
import com.netcracker.edu.tms.service.ProjectService;
import com.netcracker.edu.tms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserRestController {
    UserService userService;
    private ProjectService projectService;

    @Autowired
    public UserRestController(UserService userService, ProjectService projectService) {
        this.userService = userService;
        this.projectService = projectService;
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public ResponseEntity<Iterable<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<List<Task>> getUsersTasks(@PathVariable(name = "id", required = true) BigInteger userId) {
        return new ResponseEntity<>(projectService.getTasksByUserId(userId), HttpStatus.OK);
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<List<Project>> getProjectsByCreatorId(@PathVariable(name = "id", required = true) BigInteger userId) {
        return new ResponseEntity<>(projectService.findProjectsByCreatorId(userId), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable(name = "id", required = true) BigInteger creatorId) {
        return new ResponseEntity<>(new User(), HttpStatus.OK);
    }

    @PostMapping("/userstoprojects")
    public ResponseEntity<User> deleteUserFromProjectsTeam(@RequestBody DeletedUserFromTeam deletedUserFromTeam) {
        User userToDeleteFromTeam = deletedUserFromTeam.getUserToDeleteFromTeam();
        BigInteger projectId = deletedUserFromTeam.getProjectId();

        if (userToDeleteFromTeam == null || projectId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        boolean operationResult = projectService.deleteUserFromTeam(userToDeleteFromTeam, projectId);

        if (!operationResult) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(userToDeleteFromTeam, HttpStatus.OK);

    }
}
