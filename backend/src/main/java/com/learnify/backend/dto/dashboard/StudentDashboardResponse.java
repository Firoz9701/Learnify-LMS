package com.learnify.backend.dto.dashboard;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentDashboardResponse {

    private Long enrolledCourses;

    private Long completedLessons;

    private Double overallProgress;

}