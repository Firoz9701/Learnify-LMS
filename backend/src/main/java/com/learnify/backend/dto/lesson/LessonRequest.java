package com.learnify.backend.dto.lesson;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LessonRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    @NotBlank(message = "Content is required")
    @Size(max = 3000)
    private String content;

    @NotNull(message = "Lesson order is required")
    private Integer lessonOrder;

    private String videoUrl;

    private Boolean freePreview = false;

    @NotNull(message = "Course ID is required")
    private Long courseId;
}