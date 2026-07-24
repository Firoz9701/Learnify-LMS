package com.learnify.backend.service;

import com.learnify.backend.dto.course.CourseRequest;
import com.learnify.backend.dto.course.CourseResponse;

import org.springframework.data.domain.Page;

import java.util.List;

public interface CourseService {

    CourseResponse createCourse(CourseRequest request);

    Page<CourseResponse> getAllCourses(
        int page,
        int size,
        String sortBy);

    List<CourseResponse> getMyCourses();

    List<CourseResponse> searchCourses(String keyword);

    CourseResponse getCourseById(Long id);

    CourseResponse updateCourse(Long id, CourseRequest request);

    void deleteCourse(Long id);
}