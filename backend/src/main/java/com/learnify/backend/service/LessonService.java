package com.learnify.backend.service;

import com.learnify.backend.dto.lesson.LessonRequest;
import com.learnify.backend.dto.lesson.LessonResponse;

import java.util.List;

public interface LessonService {

    LessonResponse createLesson(LessonRequest request);

    List<LessonResponse> getLessonsByCourse(Long courseId);

    LessonResponse getLessonById(Long id);

    LessonResponse updateLesson(Long id, LessonRequest request);

    void deleteLesson(Long id);
}