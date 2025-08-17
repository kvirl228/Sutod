package org.example.sutod_auth.Services;

import org.example.sutod_auth.Entities.Channel;

import java.util.List;

public interface ChannelService {
    Channel createChannelAndAssignToUser(Long userId, Channel channel);
    Channel createChannelAndAssignToUsers(List<Long> userIds, Channel channel);
}
