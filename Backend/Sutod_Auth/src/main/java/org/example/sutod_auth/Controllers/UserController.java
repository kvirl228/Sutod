package org.example.sutod_auth.Controllers;

import lombok.AllArgsConstructor;
import org.example.sutod_auth.Entities.User;
import org.example.sutod_auth.Entities.UserDTO.UserAnswer;
import org.example.sutod_auth.Jwt.JwtCore;
import org.example.sutod_auth.Repositories.UserRepository;
import org.example.sutod_auth.Servies.Impl.UserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private UserServiceImpl userService;

    private JwtCore jwtCore;

    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        return ResponseEntity.ok().body(authentication.getName()); // вернёт username
    }

    @GetMapping("/{name}")
    public ResponseEntity<?> getUserByName(@PathVariable String name) {
        User user = userService.findByName(name).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        UserAnswer userAnswer = new UserAnswer(user.getUsername(), user.getId());
        return ResponseEntity.ok().body(userAnswer);
    }

    @GetMapping("/id/{jwt}")
    public ResponseEntity<?> getUserByJwt(@PathVariable String jwt) {
        User user = userService.findByName(jwtCore.getNameJwt(jwt)).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok().body(user.getId());
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        User user = userService.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));;
        UserAnswer userAnswer = new UserAnswer(user.getUsername(), user.getId());
        return ResponseEntity.ok().body(userAnswer);
    }

    @GetMapping
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        if(user.getUsername() == null || user.getUsername().equals("") || user.getPassword() == null || user.getPassword().equals("")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username or password is empty");
        }
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PatchMapping("/{id}/username")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> userName) {

        String username = userName.get("username");

        if(username == null || username.trim().equals("")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is empty");
        }

        if (userService.findByName(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already in use");
        }

        User user = userService.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (user.getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already in use");
        }

        user.setUsername(username);
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<?> updateUserPassword(@PathVariable Long id, @RequestBody Map<String, String> passwords) {

        String password1 = passwords.get("password1");

        String password2 = passwords.get("password2");

       if(password1 == null || password1.equals("") || password2 == null || password2.equals("") || password1.equals(password2)) {
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username or password is empty");
       }

        User user = userService.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if(user.getPassword().equals(passwordEncoder.encode(password1)) && !user.getPassword().equals(passwordEncoder.encode(password2))) {
            user.setPassword(passwordEncoder.encode(password2));
            return ResponseEntity.ok(userRepository.save(user));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords don't match");

    }

}
