package com.learnify.backend.service.upload;

import org.springframework.web.multipart.MultipartFile;

public interface UploadService {

    String uploadThumbnail(MultipartFile file);

    String uploadVideo(MultipartFile file);
}