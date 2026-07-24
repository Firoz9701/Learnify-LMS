package com.learnify.backend.dto.lesson;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LessonResponse {

    private Long id;

    private String title;

    private String content;

    private Integer lessonOrder;

    private String videoUrl;

    private Boolean freePreview;

    private Long courseId;
}