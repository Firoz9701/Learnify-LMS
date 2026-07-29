package com.learnify.backend.controller;

import com.learnify.backend.dto.quiz.QuizAttemptRequest;
import com.learnify.backend.dto.quiz.QuizAttemptResponse;
import com.learnify.backend.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("/{courseId}/attempts")
    public ResponseEntity<QuizAttemptResponse> submitAttempt(@PathVariable Long courseId,
                                                             @RequestBody QuizAttemptRequest request,
                                                             Authentication authentication) {

        String userEmail = authentication.getName();

        QuizAttemptResponse r = quizService.saveAttempt(userEmail, courseId, request);

        return ResponseEntity.ok(r);
    }

    @GetMapping("/me/attempts")
    public ResponseEntity<List<QuizAttemptResponse>> myAttempts(Authentication authentication) {
        String userEmail = authentication.getName();

        return ResponseEntity.ok(quizService.getAttemptsForUser(userEmail));
    }

}
