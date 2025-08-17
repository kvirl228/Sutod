package org.example.sutod_auth.Services;

import lombok.RequiredArgsConstructor;
import org.example.sutod_auth.Entities.Group;
import org.springframework.stereotype.Service;

import java.util.List;

public interface GroupService {
    Group createGroupAndAssignToUser(Long userId, Group group);
    Group createGroupAndAssignToUsers(List<Long> userIds, Group group);
    void ChangeAvatar(Long groupId, String avatar);
}
