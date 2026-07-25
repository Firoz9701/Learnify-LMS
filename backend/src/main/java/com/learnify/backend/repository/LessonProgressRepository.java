package com.learnify.backend.repository;

import com.learnify.backend.entity.progress.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {

    boolean existsByStudentIdAndLessonId(Long studentId, Long lessonId);

    List<LessonProgress> findByStudentId(Long studentId);

    Optional<LessonProgress> findByStudentIdAndLessonId(Long studentId, Long lessonId);

    long countByStudentIdAndLessonCourseIdAndCompletedTrue(Long studentId, Long courseId);
}