package org.example.sutod_auth.Servies.Impl;

import lombok.RequiredArgsConstructor;
import org.example.sutod_auth.Entities.Chat;
import org.example.sutod_auth.Entities.DTO.ChatDTO;
import org.example.sutod_auth.Repositories.ChatRepository;
import org.example.sutod_auth.Repositories.UserRepository;
import org.example.sutod_auth.Servies.ChatService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;

    private final UserServiceImpl userService;

    @Override
    public List<Chat> findAllByUserId(Long id) {

        if(id==null){
            throw new IllegalArgumentException("id is null");
        }

        return chatRepository.findAllByUserId(id);
    }

    @Override
    public Optional<Chat> findById(Long id) {

        if(id==null){
            throw new IllegalArgumentException("id is null");
        }

        return chatRepository.findById(id);
    }

    @Override
    public Optional<Chat> findByParticipants(Long userId, Long user2Id) {

        if(userId==null || user2Id==null){
            throw new IllegalArgumentException("userId and user2Id is null");
        }

        return chatRepository.findByParticipants(userId,user2Id);
    }

    @Override
    public Chat createChat(Chat chat) {
        chat.setId(null);
        return chatRepository.save(chat);
    }

    @Override
    public void deleteChatById(Long id) {
        chatRepository.deleteById(id);
    }

    @Override
    public ChatDTO convertToDto(Chat chat, Long currentUserId) {

        Long otherUserId = chat.getUserId().equals(currentUserId)
                ? chat.getUser2Id()
                : chat.getUserId();

        String username = userService.findById(otherUserId).get().getUsername();

        return new ChatDTO(
                username,
                currentUserId,
                otherUserId,
                chat.getId()
        );
    }
}
