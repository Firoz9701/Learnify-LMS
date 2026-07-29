package com.learnify.backend.controller;

import com.learnify.backend.dto.progress.ProgressRequest;
import com.learnify.backend.dto.progress.ProgressResponse;
import com.learnify.backend.service.ProgressService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    @PostMapping
    public ResponseEntity<ProgressResponse> completeLesson(
            @Valid @RequestBody ProgressRequest request) {

        ProgressResponse response = progressService.completeLesson(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    @GetMapping
    public ResponseEntity<List<ProgressResponse>> getStudentProgress() {

        return ResponseEntity.ok(
                progressService.getStudentProgress());

    }
}