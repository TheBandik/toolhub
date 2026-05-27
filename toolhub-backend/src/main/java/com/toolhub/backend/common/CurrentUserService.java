package com.toolhub.backend.common;

import com.toolhub.backend.user.User;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CurrentUserService {

    public User get() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User user)) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Not authenticated"
            );
        }
        return user;
    }

    public UUID getId() {
        return get().getId();
    }
}
