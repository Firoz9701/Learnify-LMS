package com.learnify.backend.controller;

import com.learnify.backend.dto.upload.UploadResponse;
import com.learnify.backend.service.upload.UploadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private final UploadService uploadService;

    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping("/thumbnail")
    public ResponseEntity<UploadResponse> uploadThumbnail(
            @RequestParam("file") MultipartFile file) {

        UploadResponse response = uploadService.uploadThumbnail(file);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/video")
    public ResponseEntity<UploadResponse> uploadVideo(
            @RequestParam("file") MultipartFile file) {

        UploadResponse response = uploadService.uploadVideo(file);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}