package org.example.sutod_auth.Controllers;

import lombok.RequiredArgsConstructor;
import org.example.sutod_auth.Entities.Message;
import org.example.sutod_auth.Servies.Impl.MessageServiceImpl;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class MessageWebSocketController {

    private final MessageServiceImpl messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send.{recipientId}")
    public void handleMessage( @DestinationVariable Long recipientId, @Payload Message request) {

        request.setTimestamp(LocalDateTime.now());

        Message savedMessage = messageService.sendMessage(request, recipientId);

        messagingTemplate.convertAndSendToUser(savedMessage.getSenderId().toString(), "/queue/messages", savedMessage);

        messagingTemplate.convertAndSendToUser(recipientId.toString(), "/queue/messages", savedMessage);
    }
}
