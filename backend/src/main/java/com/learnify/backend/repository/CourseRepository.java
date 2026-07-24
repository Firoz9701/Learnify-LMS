package com.learnify.backend.repository;

import com.learnify.backend.entity.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import com.learnify.backend.entity.auth.User;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByInstructor(User instructor);
}