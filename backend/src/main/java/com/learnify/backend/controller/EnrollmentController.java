package com.learnify.backend.controller;

import com.learnify.backend.dto.enrollment.EnrollmentRequest;
import com.learnify.backend.dto.enrollment.EnrollmentResponse;
import com.learnify.backend.service.EnrollmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    @PostMapping("/student/{studentId}")
    public ResponseEntity<EnrollmentResponse> enrollStudent(
            @PathVariable Long studentId,
            @Valid @RequestBody EnrollmentRequest request) {

        EnrollmentResponse response =
                enrollmentService.enrollStudent(studentId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<EnrollmentResponse>> getStudentEnrollments(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                enrollmentService.getStudentEnrollments(studentId));
    }

    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<EnrollmentResponse>> getCourseEnrollments(
            @PathVariable Long courseId) {

        return ResponseEntity.ok(
                enrollmentService.getCourseEnrollments(courseId));
    }
}