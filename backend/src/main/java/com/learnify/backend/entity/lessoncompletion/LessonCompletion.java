package com.learnify.backend.entity.lessoncompletion;

import com.learnify.backend.entity.BaseEntity;
import com.learnify.backend.entity.auth.User;
import com.learnify.backend.entity.lesson.Lesson;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "lesson_completions",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "student_id",
                                "lesson_id"
                        }
                )
        }
)
public class LessonCompletion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(nullable = false)
    private LocalDateTime completedAt = LocalDateTime.now();

    public LessonCompletion() {
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}