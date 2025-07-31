package org.example.sutod_auth.Servies;

import org.example.sutod_auth.Entities.User;

import java.util.List;
import java.util.Optional;

public interface UserServiceIntr{

    List<User> findAll();

    Optional<User> findByName(String name);

    Optional<User> findById(Long id);


}
