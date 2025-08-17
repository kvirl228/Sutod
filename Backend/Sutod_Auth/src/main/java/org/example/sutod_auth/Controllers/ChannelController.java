package org.example.sutod_auth.Controllers;

import lombok.AllArgsConstructor;
import org.example.sutod_auth.Entities.Channel;
import org.example.sutod_auth.Entities.DTO.ChannelDTO;
import org.example.sutod_auth.Services.Impl.ChannelServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/channel")
@AllArgsConstructor
public class ChannelController {
    private ChannelServiceImpl channelService;
    private final Logger logger = LoggerFactory.getLogger(ChannelController.class);

    @PostMapping("/create")
    public ResponseEntity<Channel> createChannel(@RequestBody ChannelDTO requestChannel) {

        if(requestChannel.getChannelName()==null){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        Channel channel = new Channel();
        channel.setChannelName(requestChannel.getChannelName());
        channel.setOwnerId(requestChannel.getOwnerId());

        Channel newChannel = channelService.createChannelAndAssignToUsers(requestChannel.getUsersToAdd(), channel);

        return ResponseEntity.ok(newChannel);
    }
    public ResponseEntity<List<Channel>> getAllChannels() {
        return ResponseEntity.ok(channelService.getAllChannels());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Channel> getChannel(@PathVariable Long id) {
        return ResponseEntity.ok(channelService.getChannel(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChannel(@PathVariable Long id) {
        channelService.deleteChannel(id);
        return ResponseEntity.ok().build();
    }
}
