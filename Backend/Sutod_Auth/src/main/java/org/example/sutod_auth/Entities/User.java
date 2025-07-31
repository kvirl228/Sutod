package org.example.sutod_auth.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Table(name = "users", schema = "app_schema")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "c_username")
    String username;

    @Column(name = "c_email")
    String email;

    @Column(name = "c_password")
    String password;

    @Column(name = "c_is_online")
    boolean is_online;
}

