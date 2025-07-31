package org.example.sutod_auth.Controllers;

import lombok.RequiredArgsConstructor;
import org.example.sutod_auth.Entities.Message;
import org.example.sutod_auth.Entities.User;
import org.example.sutod_auth.Repositories.UserRepository;
import org.example.sutod_auth.Servies.Impl.MessageServiceImpl;
import org.example.sutod_auth.Servies.MessageService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Pageable;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageServiceImpl messageService;
    private final UserRepository userRepository;

    @GetMapping("/chat/{chatId}/recent")
    public ResponseEntity<List<Message>> getRecentMessages(@PathVariable Long chatId, Principal principal) {

        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new RuntimeException("User not found"));

        if (!messageService.hasAccessToChat(currentUser.getId(), chatId)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

        List<Message> messages = messageService.findTop50ByChatIdOrderByTimestampDesc(chatId);

        return ResponseEntity.ok().body(messages);
    }

//    @GetMapping("/chat/{chatId}/page")
//    public ResponseEntity<List<Message>> getMessagesPage(
//            @PathVariable Long chatId,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "50") int size) {
//
//        Pageable pageable = (Pageable) PageRequest.of(page, size, Sort.by("timestamp").descending());
//        Page<Message> messagePage = messageRepository.findByChatId(chatId, pageable);
//
//        List<MessageResponse> response = messagePage.getContent().stream()
//                .map(this::convertToDto)
//                .collect(Collectors.toList());
//
//        return ResponseEntity.ok(response);
//    }
}
