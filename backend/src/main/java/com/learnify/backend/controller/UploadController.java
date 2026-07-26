package com.learnify.backend.controller;

import com.learnify.backend.service.upload.UploadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private final UploadService uploadService;

    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping("/thumbnail")
    public ResponseEntity<Map<String, String>> uploadThumbnail(
            @RequestParam("file") MultipartFile file) {

        String filePath = uploadService.uploadThumbnail(file);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("filePath", filePath));
    }

    @PostMapping("/video")
    public ResponseEntity<Map<String, String>> uploadVideo(
            @RequestParam("file") MultipartFile file) {

        String filePath = uploadService.uploadVideo(file);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("filePath", filePath));
    }
}