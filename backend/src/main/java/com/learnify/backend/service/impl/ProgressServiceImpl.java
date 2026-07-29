package com.learnify.backend.service.impl;

import com.learnify.backend.dto.progress.ProgressRequest;
import com.learnify.backend.dto.progress.ProgressResponse;
import com.learnify.backend.entity.auth.User;
import com.learnify.backend.entity.enrollment.Enrollment;

import com.learnify.backend.entity.lesson.Lesson;
import com.learnify.backend.entity.progress.LessonProgress;
import com.learnify.backend.security.SecurityUtils;

import com.learnify.backend.exception.ResourceAlreadyExistsException;
import com.learnify.backend.exception.ResourceNotFoundException;
import com.learnify.backend.repository.EnrollmentRepository;
import com.learnify.backend.repository.LessonProgressRepository;

import com.learnify.backend.repository.LessonRepository;
import com.learnify.backend.repository.UserRepository;
import com.learnify.backend.service.ProgressService;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProgressServiceImpl implements ProgressService {

        private final LessonProgressRepository lessonProgressRepository;
        private final UserRepository userRepository;
        private final LessonRepository lessonRepository;
        private final EnrollmentRepository enrollmentRepository;

        public ProgressServiceImpl(LessonProgressRepository lessonProgressRepository,
                        UserRepository userRepository,
                        LessonRepository lessonRepository,
                        EnrollmentRepository enrollmentRepository) {
                this.lessonProgressRepository = lessonProgressRepository;
                this.userRepository = userRepository;
                this.lessonRepository = lessonRepository;
                this.enrollmentRepository = enrollmentRepository;
        }

        @Override
        @Transactional
        public ProgressResponse completeLesson(ProgressRequest request) {

                User student = getCurrentUser();

                Long studentId = student.getId();

                Lesson lesson = lessonRepository.findById(request.getLessonId())
                                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found."));

                if (lessonProgressRepository.existsByStudentIdAndLessonId(
                                studentId, request.getLessonId())) {

                        throw new ResourceAlreadyExistsException(
                                        "Lesson already completed.");
                }

                LessonProgress lessonProgress = new LessonProgress();

                lessonProgress.setStudent(student);
                lessonProgress.setLesson(lesson);
                lessonProgress.setCompleted(true);
                lessonProgress.setCompletedAt(LocalDateTime.now());

                LessonProgress savedProgress = lessonProgressRepository.save(lessonProgress);

                updateEnrollmentProgress(studentId, lesson.getCourse().getId());

                return mapToResponse(savedProgress);
        }

        private void updateEnrollmentProgress(Long studentId, Long courseId) {

                Enrollment enrollment = enrollmentRepository
                                .findByStudentIdAndCourseId(studentId, courseId)
                                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found."));

                long completedLessons = lessonProgressRepository
                                .countByStudentIdAndLessonCourseIdAndCompletedTrue(
                                                studentId, courseId);

                long totalLessons = lessonRepository.countByCourseId(courseId);

                double progress = totalLessons == 0
                                ? 0
                                : (completedLessons * 100.0) / totalLessons;

                enrollment.setProgress(progress);

                enrollmentRepository.save(enrollment);
        }

        @Override
        public List<ProgressResponse> getStudentProgress() {

                User student = getCurrentUser();

                Long studentId = student.getId();
                return lessonProgressRepository.findByStudentId(studentId)
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        private ProgressResponse mapToResponse(LessonProgress progress) {

                ProgressResponse response = new ProgressResponse();

                response.setId(progress.getId());
                response.setStudentId(progress.getStudent().getId());
                response.setLessonId(progress.getLesson().getId());
                response.setCompleted(progress.getCompleted());
                response.setCompletedAt(progress.getCompletedAt());

                return response;
        }

        private User getCurrentUser() {

                String email = SecurityUtils.getCurrentUserEmail();

                return userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        }
}