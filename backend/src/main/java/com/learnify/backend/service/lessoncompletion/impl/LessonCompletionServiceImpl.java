package com.learnify.backend.service.lessoncompletion.impl;

import com.learnify.backend.entity.course.Course;
import com.learnify.backend.entity.enrollment.Enrollment;
import com.learnify.backend.entity.lesson.Lesson;
import com.learnify.backend.entity.lessoncompletion.LessonCompletion;
import com.learnify.backend.entity.auth.User;

import com.learnify.backend.exception.ResourceAlreadyExistsException;
import com.learnify.backend.exception.ResourceNotFoundException;

import com.learnify.backend.repository.CourseRepository;
import com.learnify.backend.repository.EnrollmentRepository;
import com.learnify.backend.repository.LessonCompletionRepository;
import com.learnify.backend.repository.LessonRepository;
import com.learnify.backend.repository.UserRepository;

import com.learnify.backend.service.lessoncompletion.LessonCompletionService;

import org.springframework.stereotype.Service;

@Service
public class LessonCompletionServiceImpl implements LessonCompletionService {

    private final LessonCompletionRepository lessonCompletionRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public LessonCompletionServiceImpl(
            LessonCompletionRepository lessonCompletionRepository,
            LessonRepository lessonRepository,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            CourseRepository courseRepository) {

        this.lessonCompletionRepository = lessonCompletionRepository;
        this.lessonRepository = lessonRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public void completeLesson(Long studentId, Long lessonId) {

        if (lessonCompletionRepository.existsByStudentIdAndLessonId(studentId, lessonId)) {

            throw new ResourceAlreadyExistsException(
                    "Lesson already completed.");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found"));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Lesson not found"));

        LessonCompletion completion = new LessonCompletion();

        completion.setStudent(student);
        completion.setLesson(lesson);

        lessonCompletionRepository.save(completion);

        Course course = lesson.getCourse();

        Enrollment enrollment = enrollmentRepository
                .findByStudentId(studentId)
                .stream()
                .filter(e -> e.getCourse().getId().equals(course.getId()))
                .findFirst()
                .orElseThrow(() ->
                        new ResourceNotFoundException("Enrollment not found"));

        long completedLessons =
                lessonCompletionRepository.countByStudentIdAndLessonCourseId(
                        studentId,
                        course.getId());

        long totalLessons =
                lessonRepository.countByCourseId(course.getId());

        double progress =
                ((double) completedLessons / totalLessons) * 100;

        enrollment.setProgress(progress);

        enrollmentRepository.save(enrollment);
    }
}