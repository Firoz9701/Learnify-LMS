package com.learnify.backend.dto.enrollment;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class EnrollmentResponse {

    private Long id;

    private Long studentId;

    private Long courseId;

    private String courseTitle;

    private LocalDateTime enrolledAt;

    private Double progress;

    private String courseThumbnail;

    private Integer totalLessons;

    private Integer completedLessons;

}