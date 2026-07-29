package com.learnify.backend.controller;

import com.learnify.backend.dto.course.CourseRequest;
import com.learnify.backend.dto.course.CourseResponse;
import com.learnify.backend.service.CourseService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(
            @Valid @RequestBody CourseRequest request) {

        CourseResponse response = courseService.createCourse(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<CourseResponse>> getAllCourses(

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy) {

        return ResponseEntity.ok(
                courseService.getAllCourses(page, size, sortBy));
    }

    @GetMapping("/my")
    public ResponseEntity<List<CourseResponse>> getMyCourses() {

        return ResponseEntity.ok(courseService.getMyCourses());
    }

    @GetMapping("/search")
    public ResponseEntity<List<CourseResponse>> searchCourses(
            @RequestParam String keyword) {

        return ResponseEntity.ok(courseService.searchCourses(keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long id) {

        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest request) {

        return ResponseEntity.ok(courseService.updateCourse(id, request));
    }

    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {

        courseService.deleteCourse(id);

        return ResponseEntity.noContent().build();
    }
}