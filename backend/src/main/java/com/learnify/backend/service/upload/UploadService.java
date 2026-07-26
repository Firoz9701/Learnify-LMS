package com.learnify.backend.service.upload;

import com.learnify.backend.dto.upload.UploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UploadService {

    UploadResponse uploadThumbnail(MultipartFile file);

    UploadResponse uploadVideo(MultipartFile file);
}