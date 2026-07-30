package com.learnify.backend.repository;

import com.learnify.backend.entity.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import com.learnify.backend.entity.auth.User;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course> {
    List<Course> findByInstructor(User instructor);

    Optional<Course> findByIdAndInstructor(Long id, User instructor);

    List<Course> findByTitleContainingIgnoreCase(String keyword);

    Optional<Course> findByTitle(String title);
}