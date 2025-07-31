package org.example.sutod_auth.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages", schema = "app_schema")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "c_message")
    private String message;

    @Column(name = "c_senderid")
    private Long senderId;

    @Column(name = "c_chatid")
    private Long chatId;

    @Column(name = "c_timestamp")
    private LocalDateTime timestamp;

}
