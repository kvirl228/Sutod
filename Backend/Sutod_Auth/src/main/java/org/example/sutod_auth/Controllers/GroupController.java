package org.example.sutod_auth.Controllers;

import lombok.AllArgsConstructor;
import org.example.sutod_auth.Entities.DTO.GroupDTO;
import org.example.sutod_auth.Entities.Group;
import org.example.sutod_auth.Services.Impl.GroupServiceImpl;
import org.example.sutod_auth.Services.Impl.UserServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@AllArgsConstructor
public class GroupController {
    private GroupServiceImpl groupService;
    private final Logger logger = LoggerFactory.getLogger(GroupController.class);

    @PostMapping("/create")
    public ResponseEntity<Group> createGroup(@RequestBody GroupDTO requestGroup) {

        if(requestGroup.getGroupName()==null){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        Group group = new Group();
        group.setAvatar(requestGroup.getAvatar());
        group.setGroupName(requestGroup.getGroupName());
        group.setCreatorId(requestGroup.getCreatorId());

        Group newGroup = groupService.createGroupAndAssignToUsers(requestGroup.getUsersToAdd(), group);

        return ResponseEntity.ok(newGroup);
    }
    public ResponseEntity<List<Group>> getAllGroups() {
        return ResponseEntity.ok(groupService.getAllGroups());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroup(@PathVariable Long id) {
        return ResponseEntity.ok(groupService.getGroup(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long id) {
        groupService.deleteGroup(id);
        return ResponseEntity.ok().build();
    }
}
