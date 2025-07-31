package org.example.sutod_auth.Controllers;

import lombok.AllArgsConstructor;
import org.example.sutod_auth.Entities.Chat;
import org.example.sutod_auth.Servies.Impl.ChatServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chats")
@AllArgsConstructor
public class ChatController {

    private final ChatServiceImpl chatService;

    @GetMapping("/{id}")
    public ResponseEntity<List<Chat>> getAllChatsByUserId(@PathVariable Long id) {
        return ResponseEntity.ok().body(chatService.findAllByUserId(id));
    }

    @GetMapping("/chat/{id}")
    public ResponseEntity<Optional<Chat>> getChatById(@PathVariable Long id) {
        return ResponseEntity.ok().body(chatService.findById(id));
    }

    @GetMapping("/twoId")
    public ResponseEntity<Long> getAllChatsByUserIdTwoId(@RequestParam Long id1, @RequestParam Long id2) {
        try {
            Long chatId = chatService.findByParticipants(id1, id2).get().getId();
            return ResponseEntity.ok(chatId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<Chat> createChat(@RequestBody Chat chat) {
        if(chat.getUserId()==null || chat.getUser2Id()==null){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        System.out.println("POST /api/chats called with: " + chat);
        return ResponseEntity.ok(chatService.createChat(chat));
    }

    @DeleteMapping
    public ResponseEntity<?> deleteChatById(@PathVariable Long id) {
        chatService.deleteChatById(id);
        return ResponseEntity.ok().build();
    }
}
