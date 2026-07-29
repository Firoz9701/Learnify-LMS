package com.learnify.backend.controller;

import com.learnify.backend.dto.dashboard.StudentDashboardResponse;
import com.learnify.backend.service.dashboard.StudentDashboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class StudentDashboardController {

    private final StudentDashboardService studentDashboardService;

    public StudentDashboardController(
            StudentDashboardService studentDashboardService) {

        this.studentDashboardService = studentDashboardService;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<StudentDashboardResponse> getDashboard(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                studentDashboardService.getDashboard(studentId));
    }
}