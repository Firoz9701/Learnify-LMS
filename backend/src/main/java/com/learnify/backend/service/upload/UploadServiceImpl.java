package com.learnify.backend.service.upload;

import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.learnify.backend.dto.upload.UploadResponse;

@Service
public class UploadServiceImpl implements UploadService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public UploadResponse uploadThumbnail(MultipartFile file) {

        validateImage(file);
        validateImageSize(file);

        return saveFile(file, "thumbnails");
    }

    @Override
    public UploadResponse uploadVideo(MultipartFile file) {

        validateVideo(file);
        validateVideoSize(file);

        return saveFile(file, "videos");
    }

    private UploadResponse saveFile(MultipartFile file, String folder) {

        try {

            Path uploadPath = Paths.get(uploadDir, folder);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

            String extension = "";

            int index = originalFilename.lastIndexOf('.');

            if (index > 0) {
                extension = originalFilename.substring(index);
            }

            String fileName = UUID.randomUUID() + extension;

            Path targetLocation = uploadPath.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    targetLocation,
                    StandardCopyOption.REPLACE_EXISTING);

            String filePath = folder + "/" + fileName;

            String fileUrl = "http://localhost:8080/uploads/" + filePath;

            return new UploadResponse(
                    fileName,
                    filePath,
                    fileUrl);

        } catch (IOException ex) {

            throw new RuntimeException(
                    "Could not store file.", ex);
        }
    }

    private void validateImage(MultipartFile file) {

        String contentType = file.getContentType();

        if (contentType == null ||
                !(contentType.equals("image/jpeg")
                        || contentType.equals("image/png"))) {

            throw new IllegalArgumentException(
                    "Only JPG, JPEG and PNG images are allowed.");
        }
    }

    private void validateImageSize(MultipartFile file) {

        long maxSize = 5 * 1024 * 1024; // 5 MB

        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException(
                    "Image size cannot exceed 5 MB.");
        }
    }

    private void validateVideo(MultipartFile file) {

        String contentType = file.getContentType();

        if (contentType == null ||
                !(contentType.equals("video/mp4")
                        || contentType.equals("video/quicktime"))) {

            throw new IllegalArgumentException(
                    "Only MP4 and MOV videos are allowed.");
        }
    }

    private void validateVideoSize(MultipartFile file) {

        long maxSize = 500L * 1024 * 1024; // 500 MB

        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException(
                    "Video size cannot exceed 500 MB.");
        }
    }
}