package com.learnify.backend.repository;

import com.learnify.backend.entity.QuizAttempt;
import com.learnify.backend.entity.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    List<QuizAttempt> findByUserOrderByAttemptedAtDesc(User user);

}
