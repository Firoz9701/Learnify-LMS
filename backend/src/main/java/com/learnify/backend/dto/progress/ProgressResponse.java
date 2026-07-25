package com.learnify.backend.dto.progress;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ProgressResponse {

    private Long id;
    private Long studentId;
    private Long lessonId;
    private Boolean completed;
    private LocalDateTime completedAt;
}