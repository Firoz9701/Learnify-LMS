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

import com.learnify.backend.repository.LessonRepository;
import com.learnify.backend.repository.LessonProgressRepository;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

        private final EnrollmentRepository enrollmentRepository;
        private final UserRepository userRepository;
        private final CourseRepository courseRepository;
        private final LessonRepository lessonRepository;
        private final LessonProgressRepository lessonProgressRepository;

        public EnrollmentServiceImpl(
                        EnrollmentRepository enrollmentRepository,
                        UserRepository userRepository,
                        CourseRepository courseRepository, LessonRepository lessonRepository,
                        LessonProgressRepository lessonProgressRepository) {

                this.enrollmentRepository = enrollmentRepository;
                this.userRepository = userRepository;
                this.courseRepository = courseRepository;
                this.lessonRepository = lessonRepository;
                this.lessonProgressRepository = lessonProgressRepository;
        }

        @Override
        @Transactional
        public EnrollmentResponse enroll(Long courseId) {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                String email = authentication.getName();

                User student = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new ResourceNotFoundException("Course not found."));

                if (enrollmentRepository.existsByStudentIdAndCourseId(
                                student.getId(), courseId)) {

                        throw new ResourceAlreadyExistsException(
                                        "Student is already enrolled in this course.");
                }

                if (Boolean.FALSE.equals(student.getEmailVerified()) && course.getPrice().compareTo(BigDecimal.ZERO) > 0) {
                        throw new IllegalArgumentException("Please verify your email before enrolling in paid courses.");
                }

                Enrollment enrollment = new Enrollment();

                enrollment.setStudent(student);
                enrollment.setCourse(course);

                if (course.getPrice().compareTo(BigDecimal.ZERO) > 0) {
                        enrollment.setAmountPaid(course.getPrice());
                        enrollment.setPaymentStatus("PAID");
                        enrollment.setPaymentReference("SIM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                        enrollment.setPaidAt(java.time.LocalDateTime.now());
                } else {
                        enrollment.setAmountPaid(BigDecimal.ZERO);
                        enrollment.setPaymentStatus("FREE");
                }

                Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

                return mapToResponse(savedEnrollment);
        }

        @Override
        @Transactional(readOnly = true)
        public List<EnrollmentResponse> getMyEnrollments() {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                String email = authentication.getName();

                User student = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

                return enrollmentRepository.findByStudentId(student.getId())
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        private EnrollmentResponse mapToResponse(Enrollment enrollment) {

                EnrollmentResponse response = new EnrollmentResponse();

                response.setId(enrollment.getId());

                response.setStudentId(
                                enrollment.getStudent().getId());

                response.setCourseId(
                                enrollment.getCourse().getId());

                response.setCourseTitle(
                                enrollment.getCourse().getTitle());

                response.setCourseThumbnail(
                                enrollment.getCourse().getThumbnail());

                response.setEnrolledAt(
                                enrollment.getEnrolledAt());

                long totalLessons = lessonRepository.countByCourseId(
                                enrollment.getCourse().getId());

                long completedLessons = lessonProgressRepository
                                .countByStudentIdAndLessonCourseIdAndCompletedTrue(
                                                enrollment.getStudent().getId(),
                                                enrollment.getCourse().getId());

                response.setTotalLessons((int) totalLessons);

                response.setCompletedLessons((int) completedLessons);
                response.setAmountPaid(enrollment.getAmountPaid());
                response.setPaymentStatus(enrollment.getPaymentStatus());
                response.setPaymentReference(enrollment.getPaymentReference());
                response.setPaymentRequired(enrollment.getCourse().getPrice().compareTo(BigDecimal.ZERO) > 0);

                if (totalLessons == 0) {

                        response.setProgress(0.0);

                } else {

                        response.setProgress(
                                        completedLessons * 100.0 / totalLessons);

                }

                return response;
        }
}