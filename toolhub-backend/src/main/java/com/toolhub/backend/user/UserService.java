package com.toolhub.backend.user;

import com.toolhub.backend.user.dto.CreateUserRequest;
import com.toolhub.backend.user.dto.UserResponse;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        String email = request.email();
        String name = request.name();

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Email already in use"
            );
        }

        User user = new User();
        user.setEmail(email);
        user.setName(name);

        var saved = userRepository.save(user);

        return UserResponse.from(saved);
    }

    public UserResponse findById(UUID id) {
        return userRepository
            .findById(id)
            .map(UserResponse::from)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
                )
            );
    }

    public List<UserResponse> findAll() {
        return userRepository
            .findAll()
            .stream()
            .map(UserResponse::from)
            .toList();
    }
}
