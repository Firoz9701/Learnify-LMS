import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { submitAttempt } from "../../services/quizService";

function Quiz({ courseId, courseTitle }) {

    const storageKey = `quizResult_${courseId}`;

    const sampleBank = {
        // Minimal sample quizzes keyed by simple keywords or id
        java: [
            {
                id: 1,
                question: "Which keyword is used to inherit a class in Java?",
                options: ["implements", "extends", "inherits", "uses"],
                answer: 1
            },
            {
                id: 2,
                question: "Which collection allows duplicate elements?",
                options: ["Set", "Map", "List", "Queue"],
                answer: 2
            }
        ],
        react: [
            {
                id: 1,
                question: "Which hook is used for state in function components?",
                options: ["useEffect", "useState", "useContext", "useMemo"],
                answer: 1
            },
            {
                id: 2,
                question: "What does JSX compile to?",
                options: ["HTML", "React.createElement calls", "Strings", "JSON"],
                answer: 1
            }
        ],
        default: [
            {
                id: 1,
                question: "What is the primary purpose of this course?",
                options: ["Entertainment", "Learning", "Shopping", "Socializing"],
                answer: 1
            }
        ]
    };

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        // choose quiz by courseTitle keywords or courseId fallback
        const key = (courseTitle || "").toLowerCase();

        if (key.includes("java")) setQuestions(sampleBank.java);
        else if (key.includes("react")) setQuestions(sampleBank.react);
        else setQuestions(sampleBank.default);

        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setScore(parsed.score);
                setSubmitted(true);
            } catch (e) { /* ignore */ }
        }

    }, [courseId, courseTitle]);

    const handleSelect = (qid, idx) => {
        setAnswers(prev => ({ ...prev, [qid]: idx }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let correct = 0;
        for (const q of questions) {
            if (answers[q.id] === q.answer) correct++;
        }

        const pct = Math.round((correct / questions.length) * 100);
        setScore(pct);
        setSubmitted(true);

        localStorage.setItem(storageKey, JSON.stringify({ score: pct, timestamp: Date.now() }));

        if (user && user.email) {
            submitAttempt(courseId, pct).catch((err) => console.log('Failed to submit attempt', err));
        }
    };

    if (!questions || questions.length === 0) return null;

    return (
        <div className="card mt-4">
            <div className="card-body">
                <h5 className="card-title">Quick Quiz</h5>

                {submitted && score !== null ? (
                    <div className="alert alert-success">
                        <strong>Your score: {score}%</strong>
                        <div className="mt-2">This result is saved locally.</div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {questions.map((q) => (
                            <div key={q.id} className="mb-3">
                                <div className="fw-semibold mb-2">{q.question}</div>
                                {q.options.map((opt, idx) => (
                                    <div className="form-check" key={idx}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name={`q_${q.id}`}
                                            id={`q_${q.id}_${idx}`}
                                            checked={answers[q.id] === idx}
                                            onChange={() => handleSelect(q.id, idx)}
                                        />
                                        <label className="form-check-label" htmlFor={`q_${q.id}_${idx}`}>
                                            {opt}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ))}

                        <button className="btn btn-primary" type="submit">Submit Quiz</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Quiz;
