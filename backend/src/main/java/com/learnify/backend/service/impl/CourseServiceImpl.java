package com.learnify.backend.service.impl;

import com.learnify.backend.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.learnify.backend.entity.auth.User;

import com.learnify.backend.dto.course.CourseRequest;
import com.learnify.backend.dto.course.CourseResponse;
import com.learnify.backend.entity.course.Course;

import com.learnify.backend.exception.ResourceNotFoundException;
import com.learnify.backend.repository.CourseRepository;
import com.learnify.backend.service.CourseService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    private final UserRepository userRepository;

    public CourseServiceImpl(CourseRepository courseRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public CourseResponse createCourse(CourseRequest request) {

        Course course = new Course();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User instructor = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found."));

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setThumbnail(request.getThumbnail());
        course.setPrice(request.getPrice());
        course.setPublished(request.getPublished());
        course.setInstructor(instructor);

        Course savedCourse = courseRepository.save(course);

        return mapToResponse(savedCourse);
    }

    @Override
    public List<CourseResponse> getAllCourses() {

        return courseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CourseResponse getCourseById(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found."));

        return mapToResponse(course);
    }

    @Override
    public CourseResponse updateCourse(Long id, CourseRequest request) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found."));

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setThumbnail(request.getThumbnail());
        course.setPrice(request.getPrice());
        course.setPublished(request.getPublished());

        Course updatedCourse = courseRepository.save(course);

        return mapToResponse(updatedCourse);
    }

    @Override
    public void deleteCourse(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found."));

        courseRepository.delete(course);
    }

    private CourseResponse mapToResponse(Course course) {

        CourseResponse response = new CourseResponse();

        response.setId(course.getId());
        response.setTitle(course.getTitle());
        response.setDescription(course.getDescription());
        response.setThumbnail(course.getThumbnail());
        response.setPrice(course.getPrice());
        response.setPublished(course.getPublished());

        return response;
    }
}