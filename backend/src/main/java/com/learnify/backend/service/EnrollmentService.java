package com.learnify.backend.service;

import com.learnify.backend.dto.enrollment.EnrollmentResponse;

import java.util.List;

public interface EnrollmentService {

    EnrollmentResponse enroll(Long courseId);

    List<EnrollmentResponse> getMyEnrollments();
}