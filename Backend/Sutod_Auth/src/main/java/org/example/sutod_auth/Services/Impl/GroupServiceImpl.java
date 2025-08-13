package org.example.sutod_auth.Services.Impl;

import lombok.RequiredArgsConstructor;
import org.example.sutod_auth.Entities.Group;
import org.example.sutod_auth.Repositories.GroupRepository;
import org.example.sutod_auth.Services.GroupService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {
    private final GroupRepository groupRepository;

    public GroupRepository getGroupRepository() {
        return groupRepository;
    }

    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Group getGroup(Long id) {
        return groupRepository.findById(id).orElseThrow();
    }

    public void deleteGroup(Long id) {
        groupRepository.deleteById(id);
    }
}
