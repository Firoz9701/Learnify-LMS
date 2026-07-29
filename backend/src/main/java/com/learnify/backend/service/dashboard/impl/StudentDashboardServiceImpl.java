package com.learnify.backend.service.dashboard.impl;

import com.learnify.backend.dto.dashboard.StudentDashboardResponse;
import com.learnify.backend.repository.EnrollmentRepository;
import com.learnify.backend.repository.LessonCompletionRepository;
import com.learnify.backend.service.dashboard.StudentDashboardService;

import org.springframework.stereotype.Service;

@Service
public class StudentDashboardServiceImpl implements StudentDashboardService {

    private final EnrollmentRepository enrollmentRepository;
    private final LessonCompletionRepository lessonCompletionRepository;

    public StudentDashboardServiceImpl(
            EnrollmentRepository enrollmentRepository,
            LessonCompletionRepository lessonCompletionRepository) {

        this.enrollmentRepository = enrollmentRepository;
        this.lessonCompletionRepository = lessonCompletionRepository;
    }

    @Override
    public StudentDashboardResponse getDashboard(Long studentId) {

        StudentDashboardResponse response = new StudentDashboardResponse();

        long enrolledCourses =
                enrollmentRepository.findByStudentId(studentId).size();

        long completedLessons =
                lessonCompletionRepository.findAll()
                        .stream()
                        .filter(c -> c.getStudent().getId().equals(studentId))
                        .count();

        double overallProgress =
                enrollmentRepository.findByStudentId(studentId)
                        .stream()
                        .mapToDouble(e -> e.getProgress())
                        .average()
                        .orElse(0);

        response.setEnrolledCourses(enrolledCourses);
        response.setCompletedLessons(completedLessons);
        response.setOverallProgress(overallProgress);

        return response;
    }
}