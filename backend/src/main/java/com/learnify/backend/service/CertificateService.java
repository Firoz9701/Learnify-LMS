package com.learnify.backend.service;

public interface CertificateService {

    byte[] generateCertificate(Long studentId,
                               Long courseId);

}