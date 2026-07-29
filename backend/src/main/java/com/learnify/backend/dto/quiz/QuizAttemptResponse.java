package com.learnify.backend.dto.quiz;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class QuizAttemptResponse {

    private Long id;
    private Long courseId;
    private Integer score;
    private Instant attemptedAt;

}
