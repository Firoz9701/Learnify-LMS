package com.learnify.backend.controller;

import com.learnify.backend.dto.lesson.LessonRequest;
import com.learnify.backend.dto.lesson.LessonResponse;
import com.learnify.backend.service.LessonService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    @PostMapping
    public ResponseEntity<LessonResponse> createLesson(
            @Valid @RequestBody LessonRequest request) {

        LessonResponse response = lessonService.createLesson(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LessonResponse>> getLessonsByCourse(
            @PathVariable Long courseId) {

        return ResponseEntity.ok(
                lessonService.getLessonsByCourse(courseId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LessonResponse> getLessonById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                lessonService.getLessonById(id));
    }
    
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<LessonResponse> updateLesson(
            @PathVariable Long id,
            @Valid @RequestBody LessonRequest request) {

        return ResponseEntity.ok(
                lessonService.updateLesson(id, request));
    }

    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(
            @PathVariable Long id) {

        lessonService.deleteLesson(id);

        return ResponseEntity.noContent().build();
    }
}