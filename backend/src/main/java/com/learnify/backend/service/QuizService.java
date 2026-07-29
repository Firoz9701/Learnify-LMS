package com.learnify.backend.service;

import com.learnify.backend.dto.quiz.QuizAttemptRequest;
import com.learnify.backend.dto.quiz.QuizAttemptResponse;

import java.util.List;

public interface QuizService {

    QuizAttemptResponse saveAttempt(String userEmail, Long courseId, QuizAttemptRequest request);

    List<QuizAttemptResponse> getAttemptsForUser(String userEmail);

}
