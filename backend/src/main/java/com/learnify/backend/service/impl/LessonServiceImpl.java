package com.learnify.backend.service.impl;

import com.learnify.backend.dto.lesson.LessonRequest;
import com.learnify.backend.dto.lesson.LessonResponse;
import com.learnify.backend.service.LessonService;
import org.springframework.stereotype.Service;

import com.learnify.backend.entity.course.Course;
import com.learnify.backend.entity.lesson.Lesson;
import com.learnify.backend.exception.ResourceNotFoundException;
import com.learnify.backend.repository.CourseRepository;
import com.learnify.backend.repository.LessonRepository;

import java.util.List;

@Service
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;

    public LessonServiceImpl(LessonRepository lessonRepository, CourseRepository courseRepository) {
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public LessonResponse createLesson(LessonRequest request) {

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found."));

        Lesson lesson = new Lesson();

        lesson.setTitle(request.getTitle());
        lesson.setContent(request.getContent());
        lesson.setLessonOrder(request.getLessonOrder());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setFreePreview(request.getFreePreview());

        lesson.setCourse(course);

        Lesson savedLesson = lessonRepository.save(lesson);

        return mapToResponse(savedLesson);
    }

    @Override
    public List<LessonResponse> getLessonsByCourse(Long courseId) {

        return lessonRepository.findByCourseIdOrderByLessonOrderAsc(courseId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public LessonResponse getLessonById(Long id) {

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found."));

        return mapToResponse(lesson);
    }

    @Override
    public LessonResponse updateLesson(Long id, LessonRequest request) {

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found."));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found."));

        lesson.setTitle(request.getTitle());
        lesson.setContent(request.getContent());
        lesson.setLessonOrder(request.getLessonOrder());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setFreePreview(request.getFreePreview());
        lesson.setCourse(course);

        Lesson updatedLesson = lessonRepository.save(lesson);

        return mapToResponse(updatedLesson);
    }

    @Override
    public void deleteLesson(Long id) {

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found."));

        lessonRepository.delete(lesson);
    }

    private LessonResponse mapToResponse(Lesson lesson) {

        LessonResponse response = new LessonResponse();

        response.setId(lesson.getId());
        response.setTitle(lesson.getTitle());
        response.setContent(lesson.getContent());
        response.setLessonOrder(lesson.getLessonOrder());
        response.setVideoUrl(lesson.getVideoUrl());
        response.setFreePreview(lesson.getFreePreview());
        response.setCourseId(lesson.getCourse().getId());

        return response;
    }
}