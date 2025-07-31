package org.example.sutod_auth.Controllers;

import lombok.RequiredArgsConstructor;
import org.example.sutod_auth.Entities.Message;
import org.example.sutod_auth.Servies.Impl.ChatServiceImpl;
import org.example.sutod_auth.Servies.Impl.MessageServiceImpl;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class MessageWebSocketController {

    private final MessageServiceImpl messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatServiceImpl chatService;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload Message message, Principal principal) {
        // Валидация отправителя
        Long senderId = Long.parseLong(principal.getName());
        if (!senderId.equals(message.getSenderId())) {
            throw new SecurityException("Sender ID doesn't match authenticated user");
        }

        // Определение получателя (для 1-1 чата)
        Long receiverId = chatService.getOtherParticipantId(message.getChatId(), senderId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid chat ID"));

        // Сохранение сообщения
        Message savedMessage = messageService.sendMessage(message, receiverId);

        // Отправка сообщения обоим участникам чата
        messagingTemplate.convertAndSendToUser(
                senderId.toString(),
                "/queue/messages",
                savedMessage
        );

        messagingTemplate.convertAndSendToUser(
                receiverId.toString(),
                "/queue/messages",
                savedMessage
        );
    }

    @MessageMapping("/chat.read")
    public void markMessagesAsRead(@Payload ReadRequest request, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        messageService.markMessagesAsRead(request.getChatId(), userId, request.getMessageIds());

        // Уведомление собеседника об прочтении
        Long otherUserId = chatService.getOtherParticipantId(request.getChatId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid chat ID"));

        messagingTemplate.convertAndSendToUser(
                otherUserId.toString(),
                "/queue/read-receipts",
                new ReadReceipt(request.getChatId(), request.getMessageIds())
        );
    }

    @MessageExceptionHandler
    @SendToUser("/queue/errors")
    public String handleException(Exception ex) {
        return ex.getMessage();
    }

    // DTO классы
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class ReadRequest {
        private Long chatId;
        private List<Long> messageIds;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class ReadReceipt {
        private Long chatId;
        private List<Long> messageIds;
    }
}
