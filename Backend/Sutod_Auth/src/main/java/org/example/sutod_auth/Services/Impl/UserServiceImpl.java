package org.example.sutod_auth.Services.Impl;

import lombok.AllArgsConstructor;
import org.example.sutod_auth.Entities.Group;
import org.example.sutod_auth.Entities.User;
import org.example.sutod_auth.Repositories.GroupRepository;
import org.example.sutod_auth.Repositories.UserRepository;
import org.example.sutod_auth.Services.UserServiceIntr;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserServiceIntr {

    private UserRepository userRepository;
    private GroupRepository groupRepository;

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findByName(String name) {
        return userRepository.findByUsername(name);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public void addUserToGroup(Long userId, Long groupId) {
        User user = userRepository.findById(userId).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();

        user.getGroupList().add(group);
        userRepository.save(user); // updates the join table
    }

    public void removeUserFromGroup(Long userId, Long groupId) {
        User user = userRepository.findById(userId).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();

        user.getGroupList().remove(group);
        userRepository.save(user); // updates the join table
    }
}
