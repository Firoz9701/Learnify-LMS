package com.learnify.backend.service.lessoncompletion;

public interface LessonCompletionService {

    void completeLesson(Long studentId, Long lessonId);

}