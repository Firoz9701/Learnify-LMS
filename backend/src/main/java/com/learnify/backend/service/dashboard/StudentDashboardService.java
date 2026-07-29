package com.learnify.backend.service.dashboard;

import com.learnify.backend.dto.dashboard.StudentDashboardResponse;

public interface StudentDashboardService {

    StudentDashboardResponse getDashboard(Long studentId);

}