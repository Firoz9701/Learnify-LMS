package com.learnify.backend.service;

import com.learnify.backend.dto.progress.ProgressRequest;
import com.learnify.backend.dto.progress.ProgressResponse;

import java.util.List;

public interface ProgressService {

    ProgressResponse completeLesson(
            ProgressRequest request);

    List<ProgressResponse> getStudentProgress();
}