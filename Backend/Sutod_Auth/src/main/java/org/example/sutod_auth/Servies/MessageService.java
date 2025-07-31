package org.example.sutod_auth.Servies;

import org.example.sutod_auth.Entities.Message;
import org.springframework.data.repository.query.Param;

import java.awt.print.Pageable;
import java.time.LocalDateTime;
import java.util.List;

public interface MessageService {

    List<Message> findAllByChatId(Long chatId);

    List<Message> findTop50ByChatIdOrderByTimestampDesc(Long chatId);

    List<Message> findNext50ByChatIdBefore(Long chatId, LocalDateTime before, Pageable pageable);

    Message sendMessage(Message message, Long Id);

    boolean hasAccessToChat(Long userId, Long chatId);

    void deleteMessageById(Long Id);

}
