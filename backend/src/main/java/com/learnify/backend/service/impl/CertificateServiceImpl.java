package com.learnify.backend.service.impl;

import com.learnify.backend.entity.auth.User;
import com.learnify.backend.entity.course.Course;
import com.learnify.backend.entity.enrollment.Enrollment;
import com.learnify.backend.entity.QuizAttempt;
import com.learnify.backend.exception.ResourceNotFoundException;
import com.learnify.backend.repository.CourseRepository;
import com.learnify.backend.repository.EnrollmentRepository;
import com.learnify.backend.repository.QuizAttemptRepository;
import com.learnify.backend.repository.UserRepository;
import com.learnify.backend.service.CertificateService;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import java.awt.Color;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.io.File;
import java.io.IOException;

@Service
public class CertificateServiceImpl implements CertificateService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
        private final QuizAttemptRepository quizAttemptRepository;

    public CertificateServiceImpl(
            UserRepository userRepository,
            CourseRepository courseRepository,
                        EnrollmentRepository enrollmentRepository,
                        QuizAttemptRepository quizAttemptRepository) {

        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
                this.quizAttemptRepository = quizAttemptRepository;
    }

    @Override
    public byte[] generateCertificate(Long studentId, Long courseId) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found."));

        Enrollment enrollment = enrollmentRepository
                .findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found."));

        if (enrollment.getProgress() < 100) {
            throw new IllegalStateException(
                    "Complete the course before downloading the certificate.");
        }

        QuizAttempt latestAttempt = quizAttemptRepository
                .findTopByUserAndCourseIdOrderByAttemptedAtDesc(student, courseId)
                .orElseThrow(() -> new IllegalStateException(
                        "Pass the quiz before downloading the certificate."));

        if (latestAttempt.getScore() == null || latestAttempt.getScore() < 60) {
            throw new IllegalStateException(
                    "Pass the quiz before downloading the certificate.");
        }

        try {

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4.rotate());
            document.setMargins(28f, 28f, 24f, 24f);

            PdfWriter.getInstance(document, outputStream);

            document.open();

            Rectangle border = new Rectangle(
                    30,
                    30,
                    812,
                    565);

            border.setBorder(Rectangle.BOX);
            border.setBorderWidth(4);
            border.setBorderColor(new Color(79, 70, 229));

            document.add(border);

            // Font titleFont = new Font(Font.HELVETICA, 30, Font.BOLD);

            // Font headingFont = new Font(Font.HELVETICA, 20, Font.BOLD);

            Font normalFont = new Font(Font.HELVETICA, 15);

            Font nameFont = new Font(
                    Font.HELVETICA,
                    28,
                    Font.BOLD,
                    new Color(34, 34, 34));

            Font headingFont = new Font(Font.HELVETICA, 22, Font.BOLD);

            addLogo(document);

            document.add(new Paragraph(" "));

            Paragraph certificate = new Paragraph(
                    "CERTIFICATE OF COMPLETION",
                    headingFont);

            certificate.setAlignment(Element.ALIGN_CENTER);

            document.add(certificate);

            document.add(new Paragraph(" "));

            Paragraph line1 = new Paragraph("This certifies that", normalFont);

            line1.setAlignment(Element.ALIGN_CENTER);

            document.add(line1);

            document.add(new Paragraph(" "));

            Paragraph studentName = new Paragraph(
                    student.getFirstName() + " " + student.getLastName(),
                    nameFont);

            studentName.setAlignment(Element.ALIGN_CENTER);

            document.add(studentName);

            document.add(new Paragraph(" "));

            Paragraph line2 = new Paragraph("has successfully completed the course", normalFont);

            line2.setAlignment(Element.ALIGN_CENTER);

            document.add(line2);

            document.add(new Paragraph(" "));

            Paragraph courseTitle = new Paragraph(course.getTitle(), headingFont);

            courseTitle.setAlignment(Element.ALIGN_CENTER);

            document.add(courseTitle);

            document.add(new Paragraph(" "));

            Paragraph progress = new Paragraph(
                    "Course Progress : "
                            + enrollment.getProgress()
                            + "%",
                    normalFont);

            progress.setAlignment(Element.ALIGN_CENTER);

            document.add(progress);

            document.add(new Paragraph(" "));

            Paragraph date = new Paragraph(
                    "Completion Date : "
                            + LocalDate.now(),
                    normalFont);

            date.setAlignment(Element.ALIGN_CENTER);

            document.add(date);

            document.add(new Paragraph(" "));

            Paragraph line = new Paragraph(
                    "____________________________");

            line.setAlignment(Element.ALIGN_CENTER);

            document.add(line);

            Paragraph sign = new Paragraph(
                    "Authorized Instructor",
                    normalFont);

            sign.setAlignment(Element.ALIGN_CENTER);

            document.add(sign);

            // document.add(sign);

            document.add(new Paragraph(" "));

            Paragraph certificateId = new Paragraph(
                    "Certificate ID : LF-"
                            + studentId
                            + "-"
                            + courseId
                            + "-"
                            + System.currentTimeMillis(),
                    new Font(Font.HELVETICA, 11));

            certificateId.setAlignment(Element.ALIGN_CENTER);

            document.add(certificateId);

            document.close();

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException("Unable to generate certificate.", e);

        }
    }

    private void addLogo(Document document) throws IOException, BadElementException {
        String[] candidatePaths = {
                "frontend/public/logo-full.png",
                "../frontend/public/logo-full.png",
                "src/main/resources/static/logo-full.png"
        };

        for (String path : candidatePaths) {
            File logoFile = new File(path);
            if (logoFile.exists() && logoFile.isFile()) {
                Image logo = Image.getInstance(logoFile.getAbsolutePath());
                logo.scaleToFit(260f, 70f);
                logo.setAlignment(Element.ALIGN_CENTER);
                document.add(logo);
                return;
            }
        }

        Paragraph fallbackTitle = new Paragraph(
                "LEARNIFY",
                new Font(Font.HELVETICA, 26, Font.BOLD, new Color(79, 70, 229)));
        fallbackTitle.setAlignment(Element.ALIGN_CENTER);
        document.add(fallbackTitle);
    }
}