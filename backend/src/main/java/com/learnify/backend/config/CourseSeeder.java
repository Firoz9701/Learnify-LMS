package com.learnify.backend.config;

import com.learnify.backend.entity.auth.User;
import com.learnify.backend.entity.course.Course;
import com.learnify.backend.repository.CourseRepository;
import com.learnify.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.learnify.backend.enums.RoleName;

import java.math.BigDecimal;

@Component
public class CourseSeeder implements CommandLineRunner {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public CourseSeeder(
            CourseRepository courseRepository,
            UserRepository userRepository) {

        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {

        if (courseRepository.count() > 0) {

            System.out.println("Courses already exist. Seeder skipped.");
            return;
        }

        User instructor = userRepository
                .findByEmail("instructor@learnify.com")
                .orElse(null);

        if (instructor == null) {

            System.out.println("Instructor not found. Seeder skipped.");
            return;
        }

        System.out.println("Creating Learnify demo courses...");

        // Courses will be added here

        saveCourse(
                instructor,
                "Java Programming Masterclass",
                "Master Java from basics to advanced concepts including OOP, Collections, Multithreading, Exception Handling and JDBC.",
                "/images/java.jpg",
                "https://www.youtube.com/watch?v=eIrMbAQSU34",
                1999);

        saveCourse(
                instructor,
                "Spring Boot REST API Development",
                "Learn to build production-ready REST APIs using Spring Boot, Spring Security, JWT Authentication, JPA and MySQL.",
                "/images/springboot.jpg",
                "https://www.youtube.com/watch?v=9SGDpanrc8U",
                2499);

        saveCourse(
                instructor,
                "React.js Complete Guide",
                "Build modern React applications using Hooks, Context API, Routing, Axios and Bootstrap.",
                "/images/react.jpg",
                "https://www.youtube.com/watch?v=bMknfKXIFA8",
                1799);

        saveCourse(
                instructor,
                "Python for Beginners",
                "Learn Python programming from scratch with projects, file handling, OOP and automation.",
                "/images/python.jpg",
                "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
                1299);

        System.out.println("First 4 demo courses created.");

        saveCourse(
                instructor,
                "Docker & Kubernetes",
                "Learn containerization, Docker Compose, Kubernetes deployments, scaling and DevOps fundamentals.",
                "/images/docker.jpg",
                "https://www.youtube.com/watch?v=3c-iBn73dDE",
                2299);

        saveCourse(
                instructor,
                "SQL & Database Design",
                "Master SQL queries, joins, indexing, normalization, transactions and database design principles.",
                "/images/sql.jpg",
                "https://www.youtube.com/watch?v=HXV3zeQKqGY",
                999);

        saveCourse(
                instructor,
                "Node.js Backend Development",
                "Build scalable backend applications using Node.js, Express, REST APIs and MongoDB.",
                "/images/node.jpg",
                "https://www.youtube.com/watch?v=Oe421EPjeBE",
                1599);

        saveCourse(
                instructor,
                "HTML, CSS & Bootstrap",
                "Build beautiful responsive websites using HTML5, CSS3 and Bootstrap framework.",
                "/images/htmlcss.jpg",
                "https://www.youtube.com/watch?v=G3e-cpL7ofc",
                799);

        saveCourse(
                instructor,
                "Data Structures & Algorithms",
                "Master arrays, linked lists, trees, graphs, dynamic programming and coding interview preparation.",
                "/images/dsa.jpg",
                "https://www.youtube.com/watch?v=RBSGKlAvoiM",
                2499);

        saveCourse(
                instructor,
                "System Design Fundamentals",
                "Learn scalability, load balancing, caching, databases, microservices and distributed systems.",
                "/images/systemdesign.jpg",
                "https://www.youtube.com/watch?v=MbjObHmDbZo",
                2999);

        saveCourse(
                instructor,
                "Git & GitHub Mastery",
                "Learn Git workflows, branching strategies, pull requests and collaborative software development.",
                "/images/git.jpg",
                "https://www.youtube.com/watch?v=RGOj5yH7evk",
                699);

        saveCourse(
                instructor,
                "AWS Cloud Essentials",
                "Learn EC2, S3, IAM, RDS, VPC and deploy applications on Amazon Web Services.",
                "/images/aws.jpg",
                "https://www.youtube.com/watch?v=ulprqHHWlng",
                2799);
        System.out.println("12 Learnify demo courses created successfully.");

    }

    private void saveCourse(
            User instructor,
            String title,
            String description,
            String thumbnail,
            String videoUrl,
            double price) {

        Course course = new Course();

        course.setTitle(title);
        course.setDescription(description);
        course.setThumbnail(thumbnail);
        course.setVideoUrl(videoUrl);
        course.setPrice(BigDecimal.valueOf(price));
        course.setPublished(true);
        course.setInstructor(instructor);

        courseRepository.save(course);
    }

}