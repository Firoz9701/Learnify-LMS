package com.learnify.backend.config;

import com.learnify.backend.entity.course.Course;
import com.learnify.backend.entity.lesson.Lesson;
import com.learnify.backend.repository.CourseRepository;
import com.learnify.backend.repository.LessonRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(4)
public class LessonSeeder implements CommandLineRunner {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;

    public LessonSeeder(LessonRepository lessonRepository,
            CourseRepository courseRepository) {

        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public void run(String... args) {

        if (lessonRepository.count() > 0) {

            System.out.println("Lessons already exist. Seeder skipped.");
            return;
        }

        seedLessons();

        System.out.println("Lessons seeded successfully.");
    }

    private void seedLessons() {

        Course javaCourse = courseRepository.findByTitle("Java Programming Masterclass")
                .orElse(null);

        Course springCourse = courseRepository.findByTitle("Spring Boot REST API Development")
                .orElse(null);

        Course reactCourse = courseRepository.findByTitle("React.js Complete Guide")
                .orElse(null);

        Course pythonCourse = courseRepository.findByTitle("Python for Beginners")
                .orElse(null);

        Course dockerCourse = courseRepository.findByTitle("Docker & Kubernetes")
                .orElse(null);

        Course sqlCourse = courseRepository.findByTitle("SQL & Database Design")
                .orElse(null);

        Course nodeCourse = courseRepository.findByTitle("Node.js Backend Development")
                .orElse(null);

        Course htmlCourse = courseRepository.findByTitle("HTML, CSS & Bootstrap")
                .orElse(null);

        Course dsaCourse = courseRepository.findByTitle("Data Structures & Algorithms")
                .orElse(null);

        Course systemCourse = courseRepository.findByTitle("System Design Fundamentals")
                .orElse(null);

        Course gitCourse = courseRepository.findByTitle("Git & GitHub Mastery")
                .orElse(null);

        Course awsCourse = courseRepository.findByTitle("AWS Cloud Essentials")
                .orElse(null);

        seedJavaLessons(javaCourse);
        seedSpringLessons(springCourse);
        seedReactLessons(reactCourse);
        seedPythonLessons(pythonCourse);
        seedDockerLessons(dockerCourse);
        seedSqlLessons(sqlCourse);
        seedNodeLessons(nodeCourse);
        seedHtmlLessons(htmlCourse);
        seedDsaLessons(dsaCourse);
        seedSystemLessons(systemCourse);
        seedGitLessons(gitCourse);
        seedAwsLessons(awsCourse);
        // Add more seeding methods for other courses as needed
    }

    private void seedJavaLessons(Course course) {

        createLesson(
                course,
                "Introduction to Java",
                "Understand Java, JDK, JVM, JRE and write your first Java program.",
                1,
                "https://www.youtube.com/watch?v=eIrMbAQSU34",
                true);

        createLesson(
                course,
                "Variables and Data Types",
                "Learn primitive data types, variables, operators and user input in Java.",
                2,
                "https://www.youtube.com/watch?v=eIrMbAQSU34",
                false);

        createLesson(
                course,
                "Object-Oriented Programming",
                "Understand classes, objects, constructors, inheritance, polymorphism and encapsulation.",
                3,
                "https://www.youtube.com/watch?v=eIrMbAQSU34",
                false);

        createLesson(
                course,
                "Exception Handling",
                "Learn try-catch, finally, custom exceptions and best practices.",
                4,
                "https://www.youtube.com/watch?v=eIrMbAQSU34",
                false);

    }

    private void seedSpringLessons(Course course) {

        createLesson(
                course,
                "Introduction to Spring Boot",
                "Learn Spring Boot architecture, project structure and create your first Spring Boot application.",
                1,
                "https://www.youtube.com/watch?v=9SGDpanrc8U",
                true);

        createLesson(
                course,
                "Building REST APIs",
                "Create REST controllers, request mappings, CRUD operations and understand REST principles.",
                2,
                "https://www.youtube.com/watch?v=9SGDpanrc8U",
                false);

        createLesson(
                course,
                "Spring Data JPA",
                "Work with entities, repositories, relationships and MySQL using Spring Data JPA.",
                3,
                "https://www.youtube.com/watch?v=9SGDpanrc8U",
                false);

        createLesson(
                course,
                "Spring Security & JWT",
                "Secure REST APIs using Spring Security, JWT authentication and role-based authorization.",
                4,
                "https://www.youtube.com/watch?v=9SGDpanrc8U",
                false);

    }

    private void seedReactLessons(Course course) {

        createLesson(
                course,
                "Getting Started with React",
                "Learn React fundamentals, JSX, components and create your first React application.",
                1,
                "https://www.youtube.com/watch?v=bMknfKXIFA8",
                true);

        createLesson(
                course,
                "React Hooks",
                "Understand useState, useEffect and build interactive React applications.",
                2,
                "https://www.youtube.com/watch?v=bMknfKXIFA8",
                false);

        createLesson(
                course,
                "React Router & API Integration",
                "Implement routing with React Router and consume REST APIs using Axios.",
                3,
                "https://www.youtube.com/watch?v=bMknfKXIFA8",
                false);

        createLesson(
                course,
                "Context API & State Management",
                "Manage global application state using Context API and best practices.",
                4,
                "https://www.youtube.com/watch?v=bMknfKXIFA8",
                false);

    }

    private void seedPythonLessons(Course course) {

        createLesson(
                course,
                "Introduction to Python",
                "Learn Python installation, syntax, variables and write your first Python program.",
                1,
                "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
                true);

        createLesson(
                course,
                "Control Statements & Functions",
                "Understand if-else, loops, functions and parameter passing in Python.",
                2,
                "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
                false);

        createLesson(
                course,
                "Object-Oriented Programming in Python",
                "Learn classes, objects, inheritance, encapsulation and polymorphism.",
                3,
                "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
                false);

        createLesson(
                course,
                "File Handling & Modules",
                "Read and write files, work with modules, packages and exception handling.",
                4,
                "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
                false);

    }

    private void seedDockerLessons(Course course) {

        createLesson(
                course,
                "Introduction to Docker",
                "Understand containers, images, Docker architecture and install Docker on your system.",
                1,
                "https://www.youtube.com/watch?v=3c-iBn73dDE",
                true);

        createLesson(
                course,
                "Docker Images & Containers",
                "Learn how to build images, run containers, volumes, networks and Docker CLI commands.",
                2,
                "https://www.youtube.com/watch?v=3c-iBn73dDE",
                false);

        createLesson(
                course,
                "Docker Compose",
                "Run multi-container applications using Docker Compose and manage services efficiently.",
                3,
                "https://www.youtube.com/watch?v=3c-iBn73dDE",
                false);

        createLesson(
                course,
                "Introduction to Kubernetes",
                "Learn Pods, Deployments, Services, Scaling and Kubernetes fundamentals.",
                4,
                "https://www.youtube.com/watch?v=3c-iBn73dDE",
                false);

    }

    private void seedSqlLessons(Course course) {

        createLesson(
                course,
                "Introduction to SQL",
                "Learn databases, SQL syntax, creating tables and basic CRUD operations.",
                1,
                "https://www.youtube.com/watch?v=HXV3zeQKqGY",
                true);

        createLesson(
                course,
                "Joins and Relationships",
                "Understand primary keys, foreign keys and different types of SQL joins.",
                2,
                "https://www.youtube.com/watch?v=HXV3zeQKqGY",
                false);

        createLesson(
                course,
                "Normalization & Database Design",
                "Learn normalization, ER diagrams and designing efficient relational databases.",
                3,
                "https://www.youtube.com/watch?v=HXV3zeQKqGY",
                false);

        createLesson(
                course,
                "Indexes, Transactions & Optimization",
                "Improve database performance using indexes, transactions and query optimization techniques.",
                4,
                "https://www.youtube.com/watch?v=HXV3zeQKqGY",
                false);

    }

    private void seedNodeLessons(Course course) {

        createLesson(
                course,
                "Introduction to Node.js",
                "Learn what Node.js is, install it and build your first server-side JavaScript application.",
                1,
                "https://www.youtube.com/watch?v=Oe421EPjeBE",
                true);

        createLesson(
                course,
                "Express.js Fundamentals",
                "Build REST APIs using Express.js, routing, middleware and request handling.",
                2,
                "https://www.youtube.com/watch?v=Oe421EPjeBE",
                false);

        createLesson(
                course,
                "MongoDB Integration",
                "Connect Node.js with MongoDB using Mongoose and perform CRUD operations.",
                3,
                "https://www.youtube.com/watch?v=Oe421EPjeBE",
                false);

        createLesson(
                course,
                "Authentication with JWT",
                "Implement secure authentication using JWT, password hashing and authorization.",
                4,
                "https://www.youtube.com/watch?v=Oe421EPjeBE",
                false);

    }

    private void seedHtmlLessons(Course course) {

        createLesson(
                course,
                "HTML5 Fundamentals",
                "Learn HTML elements, document structure, forms, tables and semantic tags.",
                1,
                "https://www.youtube.com/watch?v=G3e-cpL7ofc",
                true);

        createLesson(
                course,
                "CSS3 Styling",
                "Master selectors, colors, fonts, Flexbox, Grid and responsive layouts.",
                2,
                "https://www.youtube.com/watch?v=G3e-cpL7ofc",
                false);

        createLesson(
                course,
                "Bootstrap Components",
                "Build responsive websites using Bootstrap grid system, cards, navbar, forms and utilities.",
                3,
                "https://www.youtube.com/watch?v=G3e-cpL7ofc",
                false);

        createLesson(
                course,
                "Responsive Website Project",
                "Combine HTML, CSS and Bootstrap to build a complete responsive landing page.",
                4,
                "https://www.youtube.com/watch?v=G3e-cpL7ofc",
                false);

    }

    private void seedDsaLessons(Course course) {

        createLesson(
                course,
                "Arrays & Time Complexity",
                "Learn arrays, Big O notation and how to analyse algorithm performance.",
                1,
                "https://www.youtube.com/watch?v=RBSGKlAvoiM",
                true);

        createLesson(
                course,
                "Linked Lists, Stacks & Queues",
                "Understand linked lists, stacks, queues and their applications.",
                2,
                "https://www.youtube.com/watch?v=RBSGKlAvoiM",
                false);

        createLesson(
                course,
                "Trees & Graphs",
                "Learn binary trees, BSTs, graph traversal using BFS and DFS.",
                3,
                "https://www.youtube.com/watch?v=RBSGKlAvoiM",
                false);

        createLesson(
                course,
                "Sorting & Searching Algorithms",
                "Implement Bubble Sort, Merge Sort, Quick Sort and Binary Search.",
                4,
                "https://www.youtube.com/watch?v=RBSGKlAvoiM",
                false);

    }

    private void seedSystemLessons(Course course) {

        createLesson(
                course,
                "Introduction to System Design",
                "Understand scalability, availability and basic architecture principles.",
                1,
                "https://www.youtube.com/watch?v=MbjObHmDbZo",
                true);

        createLesson(
                course,
                "Load Balancing & Caching",
                "Learn how load balancers and caching improve performance.",
                2,
                "https://www.youtube.com/watch?v=MbjObHmDbZo",
                false);

        createLesson(
                course,
                "Database Scaling",
                "Explore replication, sharding and database optimization strategies.",
                3,
                "https://www.youtube.com/watch?v=MbjObHmDbZo",
                false);

        createLesson(
                course,
                "Microservices Architecture",
                "Design scalable distributed systems using microservices.",
                4,
                "https://www.youtube.com/watch?v=MbjObHmDbZo",
                false);

    }

    private void seedGitLessons(Course course) {

        createLesson(
                course,
                "Introduction to Git",
                "Learn version control, repositories, commits and Git installation.",
                1,
                "https://www.youtube.com/watch?v=RGOj5yH7evk",
                true);

        createLesson(
                course,
                "Branching & Merging",
                "Create branches, merge changes and resolve merge conflicts.",
                2,
                "https://www.youtube.com/watch?v=RGOj5yH7evk",
                false);

        createLesson(
                course,
                "Working with GitHub",
                "Push repositories, clone projects, create pull requests and collaborate.",
                3,
                "https://www.youtube.com/watch?v=RGOj5yH7evk",
                false);

        createLesson(
                course,
                "Git Workflow Best Practices",
                "Understand Git Flow, feature branches, releases and team collaboration.",
                4,
                "https://www.youtube.com/watch?v=RGOj5yH7evk",
                false);

    }

    private void seedAwsLessons(Course course) {

        createLesson(
                course,
                "Introduction to AWS",
                "Understand cloud computing and AWS core services.",
                1,
                "https://www.youtube.com/watch?v=ulprqHHWlng",
                true);

        createLesson(
                course,
                "Compute Services (EC2)",
                "Launch and manage virtual servers using Amazon EC2.",
                2,
                "https://www.youtube.com/watch?v=ulprqHHWlng",
                false);

        createLesson(
                course,
                "Storage & Databases",
                "Learn Amazon S3, RDS and cloud storage concepts.",
                3,
                "https://www.youtube.com/watch?v=ulprqHHWlng",
                false);

        createLesson(
                course,
                "Deploying Applications on AWS",
                "Deploy web applications using EC2, S3 and basic networking concepts.",
                4,
                "https://www.youtube.com/watch?v=ulprqHHWlng",
                false);

    }

    private void createLesson(
            Course course,
            String title,
            String content,
            int order,
            String videoUrl,
            boolean freePreview) {

        if (course == null) {
            return;
        }

        Lesson lesson = new Lesson();

        lesson.setCourse(course);
        lesson.setTitle(title);
        lesson.setContent(content);
        lesson.setLessonOrder(order);
        lesson.setVideoUrl(videoUrl);
        lesson.setFreePreview(freePreview);

        lessonRepository.save(lesson);
    }
}