package org.example.sutod_auth.Servies.Impl;

import lombok.RequiredArgsConstructor;
import org.example.sutod_auth.Entities.Chat;
import org.example.sutod_auth.Entities.Message;
import org.example.sutod_auth.Repositories.MessageRepository;
import org.example.sutod_auth.Servies.ChatService;
import org.example.sutod_auth.Servies.MessageService;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;

    private final ChatServiceImpl chatService;

    @Override
    public List<Message> findAllByChatId(Long chatId) {
        return messageRepository.findAllByChatId(chatId);
    }

    @Override
    public List<Message> findTop50ByChatIdOrderByTimestampDesc(Long chatId) {
        return messageRepository.findTop50ByChatIdOrderByTimestampDesc(chatId);
    }

    @Override
    public List<Message> findNext50ByChatIdBefore(Long chatId, LocalDateTime before, Pageable pageable) {
        return messageRepository.findNext50ByChatIdBefore(chatId,before,pageable);
    }

    @Override
    public Message sendMessage(Message message, Long Id) {

        Long id1 = Math.max(message.getSenderId(), Id);
        Long id2 = Math.min(message.getSenderId(), Id);

        Chat chat;

        if(message.getChatId()!=null){
            chat = chatService.findById(id1).get();
        }
        else{
            chat = chatService.findByParticipants(message.getSenderId(), Id).orElseGet(() -> {
                // Если нет — создаём
                Chat newChat = new Chat();
                newChat.setUserId(message.getSenderId());
                newChat.setUser2Id(Id);
                return chatService.createChat(newChat);
            });
        }
        message.setChatId(chat.getId());

        return messageRepository.save(message);
    }

    @Override
    public boolean hasAccessToChat(Long userId, Long chatId) {
        Optional<Chat> chatOpt = chatService.findById(chatId);
        if (chatOpt.isEmpty()) {
            return false;
        }
        Chat chat = chatOpt.get();
        return userId.equals(chat.getUserId()) || userId.equals(chat.getUser2Id());
    }

    @Override
    public void deleteMessageById(Long Id) {
        messageRepository.deleteById(Id);
    }
}
