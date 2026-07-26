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

@Service
public class UploadServiceImpl implements UploadService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public String uploadThumbnail(MultipartFile file) {

        return saveFile(file, "thumbnails");
    }

    @Override
    public String uploadVideo(MultipartFile file) {

        return saveFile(file, "videos");
    }

    private String saveFile(MultipartFile file, String folder) {

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

            return folder + "/" + fileName;

        } catch (IOException ex) {

            throw new RuntimeException(
                    "Could not store file.", ex);
        }
    }
}