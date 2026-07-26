package com.learnify.backend.dto.upload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UploadResponse {

    private String fileName;
    private String filePath;
    private String fileUrl;
}