package com.learnify.backend.repository;

import com.learnify.backend.entity.lessoncompletion.LessonCompletion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonCompletionRepository
        extends JpaRepository<LessonCompletion, Long> {

    boolean existsByStudentIdAndLessonId(Long studentId, Long lessonId);

    long countByStudentIdAndLessonCourseId(Long studentId, Long courseId);

}