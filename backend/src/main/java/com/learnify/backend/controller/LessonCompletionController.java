package com.learnify.backend.controller;

import com.learnify.backend.service.lessoncompletion.LessonCompletionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lesson-completions")
public class LessonCompletionController {

    private final LessonCompletionService lessonCompletionService;

    public LessonCompletionController(
            LessonCompletionService lessonCompletionService) {

        this.lessonCompletionService = lessonCompletionService;
    }

    @PostMapping("/student/{studentId}/lesson/{lessonId}")
    public ResponseEntity<String> completeLesson(
            @PathVariable Long studentId,
            @PathVariable Long lessonId) {

        lessonCompletionService.completeLesson(studentId, lessonId);

        return ResponseEntity.ok("Lesson completed successfully.");
    }
}