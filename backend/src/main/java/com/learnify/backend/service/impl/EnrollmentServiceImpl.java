package com.learnify.backend.service.impl;

import com.learnify.backend.entity.auth.User;
import com.learnify.backend.entity.course.Course;
import com.learnify.backend.entity.enrollment.Enrollment;
import com.learnify.backend.exception.ResourceAlreadyExistsException;
import com.learnify.backend.exception.ResourceNotFoundException;
import com.learnify.backend.repository.CourseRepository;
import com.learnify.backend.repository.EnrollmentRepository;
import com.learnify.backend.repository.UserRepository;

import com.learnify.backend.dto.enrollment.EnrollmentRequest;
import com.learnify.backend.dto.enrollment.EnrollmentResponse;
import com.learnify.backend.service.EnrollmentService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public EnrollmentServiceImpl(
            EnrollmentRepository enrollmentRepository,
            UserRepository userRepository,
            CourseRepository courseRepository) {

        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public EnrollmentResponse enrollStudent(Long studentId,
            EnrollmentRequest request) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found."));

        if (enrollmentRepository.existsByStudentIdAndCourseId(
                studentId, request.getCourseId())) {

            throw new ResourceAlreadyExistsException(
                    "Student is already enrolled in this course.");
        }

        Enrollment enrollment = new Enrollment();

        enrollment.setStudent(student);
        enrollment.setCourse(course);

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        return mapToResponse(savedEnrollment);
    }

    @Override
    public List<EnrollmentResponse> getStudentEnrollments(Long studentId) {

        return enrollmentRepository.findByStudentId(studentId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<EnrollmentResponse> getCourseEnrollments(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private EnrollmentResponse mapToResponse(Enrollment enrollment) {

        EnrollmentResponse response = new EnrollmentResponse();

        response.setId(enrollment.getId());
        response.setStudentId(enrollment.getStudent().getId());
        response.setCourseId(enrollment.getCourse().getId());
        response.setEnrolledAt(enrollment.getEnrolledAt());
        response.setProgress(enrollment.getProgress());

        return response;
    }
}