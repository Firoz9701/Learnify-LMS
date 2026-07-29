package com.learnify.backend.controller;

import com.learnify.backend.service.CertificateService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<byte[]> downloadCertificate(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {

        byte[] pdf =
                certificateService.generateCertificate(studentId, courseId);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename("Learnify-Certificate-" + courseId + ".pdf")
                                .build()
                                .toString())
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}