package com.learnify.backend.dto.progress;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProgressRequest {

    @NotNull(message = "Lesson ID is required")
    private Long lessonId;
}