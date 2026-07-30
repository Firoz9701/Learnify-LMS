package com.learnify.backend.dto.course;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CourseResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String videoUrl;
    private String thumbnail;
    private BigDecimal price;
    private Boolean published;
}