package org.example.sutod_auth.Services.Impl;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.example.sutod_auth.Entities.Channel;
import org.example.sutod_auth.Entities.Group;
import org.example.sutod_auth.Entities.User;
import org.example.sutod_auth.Repositories.ChannelRepository;
import org.example.sutod_auth.Repositories.GroupRepository;
import org.example.sutod_auth.Repositories.UserRepository;
import org.example.sutod_auth.Services.ChannelService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ChannelServiceImpl implements ChannelService {
    private final ChannelRepository channelRepository;
    private final UserRepository userRepository;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Transactional
    @Override
    public Channel createChannelAndAssignToUser(Long userId, Channel channel){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        User owner = userRepository.findById(channel.getOwnerId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        channel.setOwnerId(owner.getId());

        user.getChannelList().add(channel);
        owner.getChannelList().add(channel);
        createChannel(channel);

        userRepository.save(user);

        userRepository.save(owner);

        return channel;
    }

    public Channel createChannelAndAssignToUsers(List<Long> userIds, Channel channel) {
        User owner = userRepository.findById(channel.getOwnerId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        List<Long> allUserIds = new ArrayList<>(userIds);
        if (!allUserIds.contains(owner.getId())) {
            allUserIds.add(owner.getId());
        }

        List<User> users = userRepository.findAllByIdWithGroups(allUserIds);

        channelRepository.save(channel);

        for (User user : users) {
            user.getChannelList().add(channel);
        }

        userRepository.saveAll(users);
        return channel;
    }

    public Channel createChannel(Channel channel) {
        return channelRepository.save(channel);
    }

    public List<Channel> getAllChannels() {
        return channelRepository.findAll();
    }

    public Channel getChannel(Long id) {
        return channelRepository.findById(id).orElseThrow();
    }

    public void deleteChannel(Long id) {
        channelRepository.deleteById(id);
    }
}
