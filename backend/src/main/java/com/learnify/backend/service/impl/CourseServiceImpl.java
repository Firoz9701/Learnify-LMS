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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

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

        User instructor = getCurrentInstructor();

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
    public Page<CourseResponse> getAllCourses(
            int page,
            int size,
            String sortBy) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy).ascending());

        return courseRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public CourseResponse getCourseById(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found."));

        return mapToResponse(course);
    }

    @Override
    public CourseResponse updateCourse(Long id, CourseRequest request) {

        User instructor = getCurrentInstructor();

        Course course = courseRepository.findByIdAndInstructor(id, instructor)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course not found or you are not authorized."));

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

        User instructor = getCurrentInstructor();

        Course course = courseRepository.findByIdAndInstructor(id, instructor)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course not found or you are not authorized."));

        courseRepository.delete(course);
    }

    @Override
    public List<CourseResponse> getMyCourses() {

        User instructor = getCurrentInstructor();

        return courseRepository.findByInstructor(instructor)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponse> searchCourses(String keyword) {

        return courseRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private User getCurrentInstructor() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found."));
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