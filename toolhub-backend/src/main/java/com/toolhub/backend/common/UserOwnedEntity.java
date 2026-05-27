package com.toolhub.backend.common;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public abstract class UserOwnedEntity {

    @Column(name = "user_id", nullable = false, updatable = false)
    private UUID userId;
}
