package org.example.sutod_auth.Controllers;

import lombok.RequiredArgsConstructor;
import org.example.sutod_auth.Entities.Message;
import org.example.sutod_auth.Servies.Impl.MessageServiceImpl;
import org.example.sutod_auth.Servies.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageServiceImpl messageService;

    // Получение последних 50 сообщений при открытии чата
    @GetMapping("/last/{chatId}")
    public ResponseEntity<List<Message>> getLastMessages(@PathVariable Long chatId) {
        List<Message> messages = messageService.findTop50ByChatIdOrderByTimestampDesc(chatId);
        return ResponseEntity.ok().body(messages);
    }

    // Подгрузка следующих 50 сообщений при прокрутке вверх
    @GetMapping("/load")
    public ResponseEntity<List<Message>> loadMore(@RequestParam Long chatId, @RequestParam String before)
    {
        LocalDateTime timestamp = LocalDateTime.parse(before);
        List<Message> messages = messageService.findNext50ByChatIdBefore(chatId, timestamp, 0);
        return ResponseEntity.ok().body(messages);
    }
}
