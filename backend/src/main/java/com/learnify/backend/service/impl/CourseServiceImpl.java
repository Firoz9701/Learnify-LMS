package com.learnify.backend.service.impl;

import com.learnify.backend.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.learnify.backend.entity.auth.User;

import com.learnify.backend.dto.course.CourseRequest;
import com.learnify.backend.dto.course.CourseResponse;
import com.learnify.backend.entity.course.Course;
import com.learnify.backend.entity.enrollment.Enrollment;

import com.learnify.backend.exception.ResourceNotFoundException;
import com.learnify.backend.repository.CourseRepository;
import com.learnify.backend.service.CourseService;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Subquery;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    private final UserRepository userRepository;

    public CourseServiceImpl(CourseRepository courseRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public CourseResponse createCourse(CourseRequest request) {

        Course course = new Course();

        User instructor = getCurrentInstructor();

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCategory(request.getCategory());
        course.setThumbnail(request.getThumbnail());
        course.setVideoUrl(request.getVideoUrl());
        course.setPrice(request.getPrice());
        course.setPublished(request.getPublished());
        course.setInstructor(instructor);

        Course savedCourse = courseRepository.save(course);

        return mapToResponse(savedCourse);
    }

    @Override
    public Page<CourseResponse> getAllCourses(
            int page,
            int size,
            String sortBy,
            String search,
            String category,
            String published,
            String price) {

        boolean isPopularSort = "popular".equalsIgnoreCase(sortBy);

        Specification<Course> specification = buildCourseSpecification(search, category, published, price, isPopularSort);
        Sort sort = resolveSort(sortBy);

        Pageable pageable = isPopularSort
                ? PageRequest.of(page, size)
                : PageRequest.of(page, size, sort);

        return courseRepository.findAll(specification, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public CourseResponse getCourseById(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found."));

        return mapToResponse(course);
    }

    @Override
    public CourseResponse updateCourse(Long id, CourseRequest request) {

        User instructor = getCurrentInstructor();

        Course course = courseRepository.findByIdAndInstructor(id, instructor)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course not found or you are not authorized."));

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCategory(request.getCategory());
        course.setThumbnail(request.getThumbnail());
        course.setVideoUrl(request.getVideoUrl());
        course.setPrice(request.getPrice());
        course.setPublished(request.getPublished());

        Course updatedCourse = courseRepository.save(course);

        return mapToResponse(updatedCourse);
    }

    @Override
    public void deleteCourse(Long id) {

        User instructor = getCurrentInstructor();

        Course course = courseRepository.findByIdAndInstructor(id, instructor)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course not found or you are not authorized."));

        courseRepository.delete(course);
    }

    @Override
    public List<CourseResponse> getMyCourses() {

        User instructor = getCurrentInstructor();

        return courseRepository.findByInstructor(instructor)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponse> searchCourses(String keyword) {

        return courseRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private User getCurrentInstructor() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found."));
    }

    private CourseResponse mapToResponse(Course course) {

        CourseResponse response = new CourseResponse();

        response.setId(course.getId());
        response.setTitle(course.getTitle());
        response.setDescription(course.getDescription());
        response.setCategory(course.getCategory());
        response.setVideoUrl(course.getVideoUrl());
        response.setThumbnail(course.getThumbnail());
        response.setPrice(course.getPrice());
        response.setPublished(course.getPublished());

        return response;
    }

    private Specification<Course> buildCourseSpecification(
            String search,
            String category,
            String published,
            String price,
            boolean popularSort) {

        return (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (search != null && !search.trim().isEmpty()) {
                String q = "%" + search.trim().toLowerCase() + "%";

                var titlePredicate = cb.like(cb.lower(root.get("title")), q);
                var categoryPredicate = cb.like(cb.lower(cb.coalesce(root.get("category"), "")), q);

                predicates = cb.and(predicates, cb.or(titlePredicate, categoryPredicate));
            }

            if (category != null && !category.trim().isEmpty() && !"all".equalsIgnoreCase(category.trim())) {
                predicates = cb.and(predicates,
                        cb.equal(cb.lower(cb.coalesce(root.get("category"), "")), category.trim().toLowerCase()));
            }

            if (published != null && !published.trim().isEmpty() && !"all".equalsIgnoreCase(published.trim())) {
                boolean isPublished = Boolean.parseBoolean(published.trim());
                predicates = cb.and(predicates, cb.equal(root.get("published"), isPublished));
            }

            if (price != null && !price.trim().isEmpty() && !"all".equalsIgnoreCase(price.trim())) {
                predicates = cb.and(predicates, buildPricePredicate(price.trim().toLowerCase(), root, cb));
            }

            if (popularSort && query != null && !Long.class.equals(query.getResultType())) {
                Subquery<Long> enrollmentCountSubquery = query.subquery(Long.class);
                var enrollmentRoot = enrollmentCountSubquery.from(Enrollment.class);

                enrollmentCountSubquery.select(cb.count(enrollmentRoot));
                enrollmentCountSubquery.where(cb.equal(enrollmentRoot.get("course").get("id"), root.get("id")));

                query.orderBy(
                        cb.desc(enrollmentCountSubquery),
                        cb.desc(root.get("createdAt")));
            }

            return predicates;
        };
    }

    private jakarta.persistence.criteria.Predicate buildPricePredicate(
            String price,
            jakarta.persistence.criteria.Root<Course> root,
            jakarta.persistence.criteria.CriteriaBuilder cb) {

        switch (price) {
            case "free":
                return cb.equal(root.get("price"), java.math.BigDecimal.ZERO);
            case "paid":
                return cb.greaterThan(root.get("price"), java.math.BigDecimal.ZERO);
            case "under-1000":
                return cb.lessThan(root.get("price"), new java.math.BigDecimal("1000"));
            case "1000-3000":
                return cb.and(
                        cb.greaterThanOrEqualTo(root.get("price"), new java.math.BigDecimal("1000")),
                        cb.lessThanOrEqualTo(root.get("price"), new java.math.BigDecimal("3000")));
            case "above-3000":
                return cb.greaterThan(root.get("price"), new java.math.BigDecimal("3000"));
            default:
                return cb.conjunction();
        }
    }

    private Sort resolveSort(String sortBy) {
        if (sortBy == null || sortBy.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        switch (sortBy.trim().toLowerCase()) {
            case "latest":
                return Sort.by(Sort.Direction.DESC, "createdAt");
            case "oldest":
                return Sort.by(Sort.Direction.ASC, "createdAt");
            case "price-asc":
                return Sort.by(Sort.Direction.ASC, "price");
            case "price-desc":
                return Sort.by(Sort.Direction.DESC, "price");
            case "popular":
                return Sort.by(Sort.Direction.DESC, "createdAt");
            default:
                return Sort.by(Sort.Direction.DESC, "createdAt");
        }
    }
}