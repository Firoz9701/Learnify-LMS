package com.learnify.backend.controller;

import com.learnify.backend.dto.progress.ProgressRequest;
import com.learnify.backend.dto.progress.ProgressResponse;
import com.learnify.backend.service.ProgressService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @PostMapping("/student/{studentId}")
    public ResponseEntity<ProgressResponse> completeLesson(
            @PathVariable Long studentId,
            @Valid @RequestBody ProgressRequest request) {

        ProgressResponse response =
                progressService.completeLesson(studentId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ProgressResponse>> getStudentProgress(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                progressService.getStudentProgress(studentId));
    }
}