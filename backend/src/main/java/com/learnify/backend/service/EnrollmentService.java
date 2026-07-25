package com.learnify.backend.service;

import com.learnify.backend.dto.enrollment.EnrollmentRequest;
import com.learnify.backend.dto.enrollment.EnrollmentResponse;

import java.util.List;

public interface EnrollmentService {

    EnrollmentResponse enrollStudent(Long studentId,
                                     EnrollmentRequest request);

    List<EnrollmentResponse> getStudentEnrollments(Long studentId);

    List<EnrollmentResponse> getCourseEnrollments(Long courseId);
}