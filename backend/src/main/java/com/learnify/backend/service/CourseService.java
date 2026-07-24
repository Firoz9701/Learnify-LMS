package com.learnify.backend.service;

import com.learnify.backend.dto.course.CourseRequest;
import com.learnify.backend.dto.course.CourseResponse;

import java.util.List;

public interface CourseService {

    CourseResponse createCourse(CourseRequest request);

    List<CourseResponse> getAllCourses();

    List<CourseResponse> getMyCourses();

    CourseResponse getCourseById(Long id);

    CourseResponse updateCourse(Long id, CourseRequest request);

    void deleteCourse(Long id);
}