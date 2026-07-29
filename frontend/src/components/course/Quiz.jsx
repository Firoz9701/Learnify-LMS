import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { submitAttempt } from "../../services/quizService";

function Quiz({ courseId, courseTitle }) {
    const storageKey = `quizResult_${courseId}`;
    const passThreshold = 60;

    const sampleBank = {
        java: [
            { id: 1, question: "Which keyword is used to inherit a class in Java?", options: ["implements", "extends", "inherits", "uses"], answer: 1 },
            { id: 2, question: "Which collection allows duplicate elements?", options: ["Set", "Map", "List", "Queue"], answer: 2 },
            { id: 3, question: "Which method is the entry point of a Java application?", options: ["run()", "main()", "start()", "init()"], answer: 1 },
            { id: 4, question: "Which concept allows one class to take many forms?", options: ["Encapsulation", "Polymorphism", "Abstraction", "Compilation"], answer: 1 },
            { id: 5, question: "Which keyword is used to create an object?", options: ["make", "class", "new", "this"], answer: 2 },
            { id: 6, question: "Which block is always executed whether an exception occurs or not?", options: ["catch", "throw", "final", "finally"], answer: 3 }
        ],
        spring: [
            { id: 1, question: "Which annotation marks a Spring Boot application entry class?", options: ["@SpringApp", "@SpringBootApplication", "@EnableBoot", "@BootApplication"], answer: 1 },
            { id: 2, question: "Which annotation is commonly used to define a REST controller?", options: ["@Controller", "@Component", "@RestController", "@Service"], answer: 2 },
            { id: 3, question: "Which layer usually handles database access in Spring applications?", options: ["Repository", "Controller", "Config", "Filter"], answer: 0 },
            { id: 4, question: "What does JPA stand for?", options: ["Java Persistence API", "Java Processing Adapter", "JSON Persistence Access", "Java Primary Access"], answer: 0 },
            { id: 5, question: "Which dependency injection style is generally preferred in Spring Boot?", options: ["Field injection", "Constructor injection", "Static injection", "XML injection"], answer: 1 },
            { id: 6, question: "Which HTTP method is commonly used to create a new resource?", options: ["GET", "DELETE", "PUT", "POST"], answer: 3 }
        ],
        react: [
            { id: 1, question: "Which hook is used for state in function components?", options: ["useEffect", "useState", "useContext", "useMemo"], answer: 1 },
            { id: 2, question: "What does JSX compile to?", options: ["HTML", "React.createElement calls", "Strings", "JSON"], answer: 1 },
            { id: 3, question: "Which hook is used for side effects?", options: ["useState", "useEffect", "useRef", "useReducer"], answer: 1 },
            { id: 4, question: "What prop should be unique when rendering a list?", options: ["index", "value", "key", "name"], answer: 2 },
            { id: 5, question: "Which package is commonly used for client-side routing in React?", options: ["react-switch", "react-router-dom", "router-react", "react-pages"], answer: 1 },
            { id: 6, question: "State updates in React should be treated as what?", options: ["Mutable changes", "Direct DOM writes", "Immutable updates", "Synchronous always"], answer: 2 }
        ],
        python: [
            { id: 1, question: "Which keyword defines a function in Python?", options: ["func", "define", "def", "lambda"], answer: 2 },
            { id: 2, question: "Which data type is immutable?", options: ["list", "dict", "set", "tuple"], answer: 3 },
            { id: 3, question: "What does PEP 8 describe?", options: ["Database rules", "Style guidelines", "Package manager", "Web framework"], answer: 1 },
            { id: 4, question: "Which loop is used to iterate over a sequence?", options: ["repeat", "for", "cycle", "iterate"], answer: 1 },
            { id: 5, question: "Which symbol is used for comments in Python?", options: ["//", "#", "--", "/*"], answer: 1 },
            { id: 6, question: "Which keyword handles exceptions?", options: ["catch", "rescue", "try", "throws"], answer: 2 }
        ],
        sql: [
            { id: 1, question: "Which SQL statement is used to retrieve data?", options: ["GET", "SELECT", "FETCH", "SHOW"], answer: 1 },
            { id: 2, question: "Which clause filters rows after aggregation?", options: ["WHERE", "ORDER BY", "HAVING", "LIMIT"], answer: 2 },
            { id: 3, question: "Which join returns matching rows from both tables only?", options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN"], answer: 2 },
            { id: 4, question: "Which command adds a new record to a table?", options: ["CREATE", "APPEND", "INSERT", "UPDATE"], answer: 2 },
            { id: 5, question: "Normalization mainly helps reduce what?", options: ["Indexes", "Redundancy", "Security", "Queries"], answer: 1 },
            { id: 6, question: "Which SQL keyword sorts results?", options: ["SORT BY", "ORDER BY", "GROUP BY", "RANK BY"], answer: 1 }
        ],
        docker: [
            { id: 1, question: "What is the main purpose of Docker?", options: ["Create databases", "Containerize applications", "Write Java code", "Replace Linux"], answer: 1 },
            { id: 2, question: "Which file is commonly used to define a Docker image?", options: ["docker.yml", "Dockerfile", "image.json", "compose.lock"], answer: 1 },
            { id: 3, question: "What does Kubernetes mainly help with?", options: ["Source control", "Container orchestration", "Frontend styling", "Database backups only"], answer: 1 },
            { id: 4, question: "Which command builds a Docker image?", options: ["docker run", "docker build", "docker start", "docker push"], answer: 1 },
            { id: 5, question: "What is a container?", options: ["A virtual machine only", "A lightweight packaged runtime environment", "A Java library", "A SQL table"], answer: 1 },
            { id: 6, question: "Which Kubernetes object is often used to expose an application?", options: ["Service", "Commit", "Branch", "Class"], answer: 0 }
        ],
        node: [
            { id: 1, question: "Node.js is primarily used for what?", options: ["Running Java bytecode", "Server-side JavaScript", "Designing images", "Managing SQL indexes"], answer: 1 },
            { id: 2, question: "Which framework is commonly used with Node.js for APIs?", options: ["Express", "Django", "Laravel", "Spring MVC"], answer: 0 },
            { id: 3, question: "What file usually stores Node project dependencies?", options: ["pom.xml", "package.json", "requirements.txt", "build.gradle"], answer: 1 },
            { id: 4, question: "Which method is commonly used to create an Express GET route?", options: ["app.route()", "app.listen()", "app.get()", "app.fetch()"], answer: 2 },
            { id: 5, question: "What does npm stand for?", options: ["Node Package Manager", "New Project Module", "Node Program Method", "Next Package Mode"], answer: 0 },
            { id: 6, question: "Which database is commonly paired with Node.js in MERN-style apps?", options: ["MongoDB", "Oracle Forms", "Redis only", "Excel"], answer: 0 }
        ],
        htmlcss: [
            { id: 1, question: "Which HTML tag is used for the largest heading by default?", options: ["<heading>", "<h6>", "<h1>", "<head>"], answer: 2 },
            { id: 2, question: "Which CSS property controls text color?", options: ["font-style", "background", "color", "text-weight"], answer: 2 },
            { id: 3, question: "Bootstrap is mainly used for what?", options: ["Database migrations", "Responsive UI components", "Video editing", "Authentication only"], answer: 1 },
            { id: 4, question: "Which CSS layout system is one-dimensional?", options: ["Grid", "Flexbox", "Float", "Table"], answer: 1 },
            { id: 5, question: "Which HTML attribute is used for image alternative text?", options: ["title", "alt", "src", "caption"], answer: 1 },
            { id: 6, question: "Which Bootstrap class typically creates a button with primary styling?", options: ["btn-main", "button-primary", "btn btn-primary", "btn-primary-only"], answer: 2 }
        ],
        dsa: [
            { id: 1, question: "Which data structure follows FIFO order?", options: ["Stack", "Queue", "Tree", "Graph"], answer: 1 },
            { id: 2, question: "What is the average time complexity of binary search on a sorted array?", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], answer: 1 },
            { id: 3, question: "Which traversal visits left subtree, root, then right subtree?", options: ["Preorder", "Inorder", "Postorder", "Level order"], answer: 1 },
            { id: 4, question: "Which technique solves overlapping subproblems efficiently?", options: ["Greedy only", "Dynamic programming", "Bubble sort", "Recursion without memory"], answer: 1 },
            { id: 5, question: "Which data structure is commonly used for DFS?", options: ["Queue", "Stack", "Heap", "Hash map"], answer: 1 },
            { id: 6, question: "What is a graph edge?", options: ["A sorting method", "A connection between nodes", "A tree root", "A linked-list value"], answer: 1 }
        ],
        systemdesign: [
            { id: 1, question: "What is horizontal scaling?", options: ["Adding more servers", "Increasing RAM on one server", "Compressing images", "Caching CSS"], answer: 0 },
            { id: 2, question: "What is the main role of a load balancer?", options: ["Store files", "Distribute traffic", "Write SQL queries", "Encrypt passwords only"], answer: 1 },
            { id: 3, question: "Why is caching used?", options: ["To slow responses", "To reduce latency and repeated work", "To replace databases completely", "To remove APIs"], answer: 1 },
            { id: 4, question: "What does high availability aim to improve?", options: ["Downtime", "Uptime and resilience", "Typography", "Code indentation"], answer: 1 },
            { id: 5, question: "Which pattern helps process tasks asynchronously?", options: ["Message queue", "Color palette", "Flexbox", "CSS grid"], answer: 0 },
            { id: 6, question: "Replication in databases mainly helps with what?", options: ["Read scalability and redundancy", "Removing indexes", "Frontend routing", "Compiling Java"], answer: 0 }
        ],
        git: [
            { id: 1, question: "What does `git commit` do?", options: ["Uploads code to production", "Saves a snapshot to local history", "Deletes a branch", "Installs dependencies"], answer: 1 },
            { id: 2, question: "Which command creates a new branch?", options: ["git new branch", "git branch <name>", "git fork", "git copy"], answer: 1 },
            { id: 3, question: "What is a pull request mainly used for?", options: ["Code review and merging changes", "Deleting repositories", "Changing passwords", "Running unit tests"], answer: 0 },
            { id: 4, question: "Which command downloads changes from a remote repository?", options: ["git fetch", "git clean", "git status", "git mv"], answer: 0 },
            { id: 5, question: "What does `git merge` do?", options: ["Combines branch histories", "Deletes old commits", "Creates a new repo", "Installs GitHub"], answer: 0 },
            { id: 6, question: "GitHub is best described as what?", options: ["A CSS framework", "A cloud platform for Git repositories", "A local compiler", "A SQL engine"], answer: 1 }
        ],
        aws: [
            { id: 1, question: "Which AWS service is commonly used for virtual servers?", options: ["S3", "RDS", "EC2", "IAM"], answer: 2 },
            { id: 2, question: "Which AWS service provides object storage?", options: ["Lambda", "S3", "CloudFront", "VPC"], answer: 1 },
            { id: 3, question: "What is IAM used for?", options: ["Image editing", "Identity and access management", "Internet acceleration", "API caching"], answer: 1 },
            { id: 4, question: "Which service is commonly used for managed relational databases?", options: ["RDS", "SQS", "SNS", "Route 53"], answer: 0 },
            { id: 5, question: "What does VPC stand for?", options: ["Virtual Private Cloud", "Verified Public Cluster", "Visual Processing Core", "Virtual Program Cache"], answer: 0 },
            { id: 6, question: "Which AWS pricing model helps save money for steady long-term usage?", options: ["On-demand only", "Reserved capacity style commitments", "Always free tier", "Single-login plan"], answer: 1 }
        ],
        default: [
            { id: 1, question: "What is the primary purpose of this course?", options: ["Entertainment", "Learning", "Shopping", "Socializing"], answer: 1 },
            { id: 2, question: "What is the best way to improve with this course?", options: ["Skip practice", "Watch only once", "Practice consistently", "Ignore exercises"], answer: 2 },
            { id: 3, question: "Which habit helps with long-term retention?", options: ["Cramming once", "Consistent revision", "Avoiding notes", "Skipping projects"], answer: 1 },
            { id: 4, question: "What should you do after completing a lesson?", options: ["Forget it", "Apply it in a small task", "Close the course forever", "Delete notes"], answer: 1 },
            { id: 5, question: "Why are quizzes useful in learning?", options: ["They slow progress", "They test recall and understanding", "They replace lessons", "They remove practice"], answer: 1 },
            { id: 6, question: "What is a good outcome of finishing this course?", options: ["Passive watching only", "Real skill improvement", "Less confidence", "No understanding"], answer: 1 }
        ]
    };

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [review, setReview] = useState(null);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        const key = (courseTitle || "").toLowerCase();

        if (key.includes("java")) setQuestions(sampleBank.java);
        else if (key.includes("spring")) setQuestions(sampleBank.spring);
        else if (key.includes("react")) setQuestions(sampleBank.react);
        else if (key.includes("python")) setQuestions(sampleBank.python);
        else if (key.includes("sql") || key.includes("database")) setQuestions(sampleBank.sql);
        else if (key.includes("docker") || key.includes("kubernetes")) setQuestions(sampleBank.docker);
        else if (key.includes("node")) setQuestions(sampleBank.node);
        else if (key.includes("html") || key.includes("css") || key.includes("bootstrap")) setQuestions(sampleBank.htmlcss);
        else if (key.includes("data structures") || key.includes("algorithms")) setQuestions(sampleBank.dsa);
        else if (key.includes("system design")) setQuestions(sampleBank.systemdesign);
        else if (key.includes("git") || key.includes("github")) setQuestions(sampleBank.git);
        else if (key.includes("aws") || key.includes("cloud")) setQuestions(sampleBank.aws);
        else setQuestions(sampleBank.default);

        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setScore(parsed.score);
                setSubmitted(true);
                setReview(parsed.review || null);
            } catch (e) {
                console.log("Failed to load saved quiz result", e);
            }
        }
    }, [courseId, courseTitle]);

    const handleSelect = (questionId, answerIndex) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let correct = 0;
        const reviewRows = questions.map((question) => {
            const selectedIndex = answers[question.id];
            const isCorrect = selectedIndex === question.answer;

            if (isCorrect) {
                correct++;
            }

            return {
                id: question.id,
                question: question.question,
                selectedIndex,
                selectedText: selectedIndex !== undefined ? question.options[selectedIndex] : "Not answered",
                correctIndex: question.answer,
                correctText: question.options[question.answer],
                isCorrect
            };
        });

        const percent = Math.round((correct / questions.length) * 100);
        const passed = percent >= passThreshold;

        setScore(percent);
        setSubmitted(true);
        setReview(reviewRows);

        localStorage.setItem(storageKey, JSON.stringify({
            score: percent,
            passed,
            timestamp: Date.now(),
            review: reviewRows
        }));

        if (user && user.email) {
            submitAttempt(courseId, percent).catch((err) => console.log("Failed to submit attempt", err));
        }
    };

    const handleRetake = () => {
        setAnswers({});
        setScore(null);
        setSubmitted(false);
        setReview(null);
        localStorage.removeItem(storageKey);
    };

    if (!questions.length) {
        return null;
    }

    return (
        <div className="card mt-4">
            <div className="card-body">
                <h5 className="card-title">Quick Quiz</h5>
                <p className="text-muted small mb-4">
                    Score at least {passThreshold}% to pass this quiz and mark the assessment as completed.
                </p>

                {submitted && score !== null ? (
                    <>
                        <div className={`alert ${score >= passThreshold ? "alert-success" : "alert-warning"}`}>
                            <strong>Your score: {score}%</strong>
                            <div className="mt-2">
                                {score >= passThreshold
                                    ? `Passed. You met the ${passThreshold}% completion threshold.`
                                    : `Not passed yet. You need at least ${passThreshold}% to pass this quiz.`}
                            </div>
                            <div className="mt-2">This result is saved locally.</div>
                        </div>

                        {review && review.length > 0 && (
                            <div className="mt-4">
                                <h6 className="fw-bold mb-3">Answer Review</h6>
                                {review.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`border rounded-3 p-3 mb-3 ${item.isCorrect ? "border-success bg-success-subtle" : "border-danger bg-danger-subtle"}`}
                                    >
                                        <div className="fw-semibold mb-2">{index + 1}. {item.question}</div>
                                        <div>Your answer: <strong>{item.selectedText}</strong></div>
                                        <div>Correct answer: <strong>{item.correctText}</strong></div>
                                        <div className="mt-1 fw-semibold">{item.isCorrect ? "Correct" : "Incorrect"}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button className="btn btn-outline-primary" type="button" onClick={handleRetake}>
                            Retake Quiz
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {questions.map((question, questionIndex) => (
                            <div key={question.id} className="mb-4">
                                <div className="fw-semibold mb-2">{questionIndex + 1}. {question.question}</div>
                                {question.options.map((option, optionIndex) => (
                                    <div className="form-check" key={optionIndex}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name={`q_${question.id}`}
                                            id={`q_${question.id}_${optionIndex}`}
                                            checked={answers[question.id] === optionIndex}
                                            onChange={() => handleSelect(question.id, optionIndex)}
                                        />
                                        <label className="form-check-label" htmlFor={`q_${question.id}_${optionIndex}`}>
                                            {option}
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
