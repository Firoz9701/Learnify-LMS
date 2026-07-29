package com.learnify.backend.service.impl;

import com.learnify.backend.dto.quiz.QuizAttemptRequest;
import com.learnify.backend.dto.quiz.QuizAttemptResponse;
import com.learnify.backend.entity.QuizAttempt;
import com.learnify.backend.entity.auth.User;
import com.learnify.backend.exception.ResourceNotFoundException;
import com.learnify.backend.repository.QuizAttemptRepository;
import com.learnify.backend.repository.UserRepository;
import com.learnify.backend.service.QuizService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizServiceImpl implements QuizService {

    private final QuizAttemptRepository quizAttemptRepository;
    private final UserRepository userRepository;

    public QuizServiceImpl(QuizAttemptRepository quizAttemptRepository, UserRepository userRepository) {
        this.quizAttemptRepository = quizAttemptRepository;
        this.userRepository = userRepository;
    }

    @Override
    public QuizAttemptResponse saveAttempt(String userEmail, Long courseId, QuizAttemptRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(user);
        attempt.setCourseId(courseId);
        attempt.setScore(request.getScore());

        QuizAttempt saved = quizAttemptRepository.save(attempt);

        return toResponse(saved);
    }

    @Override
    public List<QuizAttemptResponse> getAttemptsForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return quizAttemptRepository.findByUserOrderByAttemptedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private QuizAttemptResponse toResponse(QuizAttempt a) {
        QuizAttemptResponse r = new QuizAttemptResponse();
        r.setId(a.getId());
        r.setCourseId(a.getCourseId());
        r.setScore(a.getScore());
        r.setAttemptedAt(a.getAttemptedAt());
        return r;
    }
}
