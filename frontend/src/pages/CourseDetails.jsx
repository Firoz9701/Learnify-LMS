import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCurrentUserProfile, verifyEmail } from "../services/authService";
import { getCourseById, getCourseImage } from "../services/courseService";
import { enroll, getMyEnrollments } from "../services/enrollmentService";

function CourseDetails() {

    const { id } = useParams();

    const [course, setCourse] = useState(null);
    const [currentUser, setCurrentUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [checkingEnrollment, setCheckingEnrollment] = useState(true);
    const [enrollMessage, setEnrollMessage] = useState("");
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showPaymentPage, setShowPaymentPage] = useState(false);
    const [verificationToken, setVerificationToken] = useState("");
    const [verificationError, setVerificationError] = useState("");
    const [verifyingEmail, setVerifyingEmail] = useState(false);
    const [paymentForm, setPaymentForm] = useState({ cardNumber: "", cvv: "", nameOnCard: "", expiry: "" });
    const [paymentError, setPaymentError] = useState("");
    const [processingPayment, setProcessingPayment] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const isFreeCourse = Number(course?.price || 0) <= 0;

    const refreshEnrollmentStatus = useCallback(async () => {

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || user.role !== "ROLE_STUDENT") {
            setIsEnrolled(false);
            return;
        }

        try {
            const enrollments = await getMyEnrollments();
            const enrolled = enrollments.some(
                (item) => String(item.courseId) === String(id)
            );
            setIsEnrolled(enrolled);
        } catch (error) {
            console.log(error);
            setIsEnrolled(false);
        }
    }, [id]);

    const syncCurrentUser = useCallback(async () => {
        try {
            const response = await getCurrentUserProfile();
            const profile = response?.data ?? response;
            localStorage.setItem("user", JSON.stringify(profile));
            setCurrentUser(profile);
            return profile;
        } catch (error) {
            console.log(error);
            return null;
        }
    }, []);

    useEffect(() => {

        const fetchCourse = async () => {

            const user = JSON.parse(localStorage.getItem("user"));
            setCurrentUser(user);

            try {

                const data = await getCourseById(id);

                setCourse(data);

                if (user && user.role === "ROLE_STUDENT") {
                    await refreshEnrollmentStatus();
                } else {
                    setIsEnrolled(false);
                }

            } catch (error) {

                console.log(error);

            } finally {

                setCheckingEnrollment(false);

            }

        };

        fetchCourse();

    }, [id, refreshEnrollmentStatus]);

    const handleDirectEnroll = useCallback(async () => {
        try {
            await enroll(course.id);
            await refreshEnrollmentStatus();
            setEnrollMessage(`Enrollment successful${!isFreeCourse ? " and payment was recorded." : ""}.`);
            setShowPaymentPage(false);
            setShowVerifyModal(false);
        } catch (error) {
            console.log(error);
            const message = error.response?.data?.message || "Something went wrong.";
            setEnrollMessage(message);
            if ((error.response?.data?.message || "").toLowerCase().includes("already enrolled")) {
                setIsEnrolled(true);
            }
        }
    }, [course, refreshEnrollmentStatus]);

    const handleEnroll = async () => {

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            alert("Please login first.");
            return;
        }

        if (user.role !== "ROLE_STUDENT") {
            alert("Only student accounts can enroll in courses.");
            return;
        }

        if (isEnrolled) {
            return;
        }

        if (!isFreeCourse) {
            if (!user.emailVerified) {
                setShowVerifyModal(true);
                setVerificationError("");
                setEnrollMessage("Please verify your email before continuing to checkout.");
                return;
            }

            setPaymentError("");
            setShowPaymentPage(true);
            return;
        }

        await handleDirectEnroll();
    };

    const handleVerification = async (event) => {
        event.preventDefault();
        setVerificationError("");
        setVerifyingEmail(true);

        try {
            const response = await verifyEmail(verificationToken.trim());
            const refreshedUser = await syncCurrentUser();
            const verifiedUser = refreshedUser || currentUser;
            if (verifiedUser) {
                verifiedUser.emailVerified = true;
                localStorage.setItem("user", JSON.stringify(verifiedUser));
                setCurrentUser(verifiedUser);
            }
            setShowVerifyModal(false);
            setVerificationToken("");
            setEnrollMessage(response?.data?.message || "Email verified successfully. You can now continue to checkout.");
            if (!isFreeCourse) {
                setShowPaymentPage(true);
            }
        } catch (error) {
            setVerificationError(error.response?.data?.message || "Verification failed. Please check the code and try again.");
        } finally {
            setVerifyingEmail(false);
        }
    };

    const handlePaymentSubmit = async (event) => {
        event.preventDefault();
        setPaymentError("");

        const cleanCardNumber = paymentForm.cardNumber.replace(/\s/g, "");
        const cleanCvv = paymentForm.cvv.replace(/\s/g, "");

        if (!paymentForm.nameOnCard.trim()) {
            setPaymentError("Please enter the cardholder name.");
            return;
        }

        if (!/^\d{12}$/.test(cleanCardNumber)) {
            setPaymentError("Card number must be 12 digits.");
            return;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentForm.expiry.trim())) {
            setPaymentError("Expiry date must be in MM/YY format.");
            return;
        }

        if (!/^\d{3}$/.test(cleanCvv)) {
            setPaymentError("CVV must be 3 digits.");
            return;
        }

        setProcessingPayment(true);
        setPaymentError("");

        try {
            await handleDirectEnroll();
            setPaymentSuccess(true);
            setPaymentForm({ cardNumber: "", cvv: "", nameOnCard: "", expiry: "" });
        } catch (error) {
            console.log(error);
        } finally {
            setProcessingPayment(false);
        }
    };

    if (!course) {
        return (
            <div className="container py-5">
                <div className="hero-card course-details-hero text-center">
                    <h3 className="fw-bold mb-2">Loading course details...</h3>
                    <p className="text-muted mb-0">Please wait while we fetch course information.</p>
                </div>
            </div>
        );
    }

    return (

        <div className="container py-5">

            <div className="hero-card course-details-hero mb-4">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                    <div>
                        <p className="instructor-kicker mb-2">Course Overview</p>
                        <h2 className="fw-bold mb-2">{course.title}</h2>
                        <p className="text-muted mb-0">
                            Learn with structured lessons, guided practice, and a quiz after enrollment.
                        </p>
                    </div>
                    <span className={`badge ${course.published ? "text-bg-success" : "text-bg-secondary"}`}>
                        {course.published ? "Published" : "Draft"}
                    </span>
                </div>
            </div>

            <div className="row g-4">

                {/* Left Side */}
                <div className="col-lg-8">

                    <div className="card shadow-sm border-0 course-details-main">

                        <div className="card-body p-4 p-lg-5">

                            <h4 className="fw-bold mb-3">About This Course</h4>

                            <p className="text-muted mb-4">
                                {course.description}
                            </p>

                            <div className="course-learn-box mb-4">

                                <h5 className="fw-bold mb-3">What you will learn</h5>

                                <ul className="course-learn-list mb-0">

                                    <li>Complete understanding of this course.</li>

                                    <li>Hands-on practical examples.</li>

                                    <li>Real-world project implementation.</li>

                                    <li>Certificate after completion.</li>

                                </ul>

                            </div>

                            <div className="course-quiz-panel">
                                <h5 className="fw-bold mb-2">Assessment & Practice</h5>
                                <p className="text-muted mb-0">
                                    Quiz and practice exercises are available inside the learning page after enrollment.
                                </p>
                            </div>

                            {checkingEnrollment ? (
                                <div className="alert alert-light mt-4 mb-0">Checking enrollment status...</div>
                            ) : isEnrolled ? (
                                <div className="alert alert-success mt-4 mb-0">
                                    You are enrolled. Open this course from My Courses to access lessons, quiz, and practice exercises.
                                </div>
                            ) : (
                                <div className="alert alert-warning mt-4 mb-0">
                                    Enroll in this course as a student to unlock lessons, quiz, and practice exercises in My Courses.
                                </div>
                            )}

                            {enrollMessage && (
                                <div className={`alert mt-3 mb-0 ${!isFreeCourse ? "alert-info" : "alert-success"}`}>
                                    {enrollMessage}
                                </div>
                            )}

                            {!isFreeCourse && (
                                <div className="alert alert-light border mt-3 mb-0">
                                    <div className="fw-semibold mb-1">Checkout flow</div>
                                    <div className="small text-muted">
                                        {currentUser?.emailVerified
                                            ? "Email is verified. You can continue to the secure checkout form."
                                            : "Email verification is required before payment can be completed."}
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>

                </div>

                {/* Right Side */}

                <div className="col-lg-4">

                    <div className="card shadow-sm border-0 course-details-side">

                        <div className="card-body p-4">

                            <div className="course-image-wrapper mb-3">
                                <img
                                    src={getCourseImage(course)}
                                    className="course-banner"
                                    alt={course.title}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/images/reactjs.png" }}
                                />
                            </div>

                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <span className="text-muted">Price</span>
                                <h3 className="text-success fw-bold mb-0">

                                    {isFreeCourse ? "Free" : `₹ ${course.price}`}

                                </h3>
                            </div>

                            <button
                                className="btn btn-primary w-100"
                                onClick={handleEnroll}
                                disabled={isEnrolled}
                            >

                                {isEnrolled ? "Enrolled" : isFreeCourse ? "Enroll Now" : "Continue to checkout"}

                            </button>

                            <div className="course-perks mt-4">
                                <div className="course-perk-item">📚 Lifetime Access</div>
                                <div className="course-perk-item">🎥 Video Lessons</div>
                                <div className="course-perk-item">📝 Practice Exercises</div>
                                <div className="course-perk-item">🏆 Completion Certificate</div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {showVerifyModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0, 0, 0, 0.55)", zIndex: 1050 }}>
                    <div className="card shadow-lg border-0" style={{ width: "min(92vw, 460px)" }}>
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-2">Verify your email first</h5>
                            <p className="text-muted mb-3">
                                Enter the verification code you received after registration to unlock the payment checkout.
                            </p>
                            <form onSubmit={handleVerification}>
                                <label className="form-label">Verification code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={verificationToken}
                                    onChange={(event) => setVerificationToken(event.target.value)}
                                    placeholder="Paste the code here"
                                />
                                {verificationError && <div className="alert alert-danger mt-3 py-2 mb-0">{verificationError}</div>}
                                <div className="d-flex gap-2 mt-4">
                                    <button type="submit" className="btn btn-primary" disabled={verifyingEmail}>
                                        {verifyingEmail ? "Verifying..." : "Verify email"}
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowVerifyModal(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showPaymentPage && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg, rgba(12, 18, 32, 0.96), rgba(37, 99, 235, 0.88))", zIndex: 1050, padding: "20px" }}>
                    <div className="card shadow-xxl border-0 overflow-hidden" style={{ width: "min(96vw, 980px)", borderRadius: "24px" }}>
                        <div className="row g-0">
                            <div className="col-lg-5 bg-dark text-white p-4 p-lg-5 d-flex flex-column justify-content-between">
                                <div>
                                    <div className="d-flex align-items-center gap-2 mb-4">
                                        <div className="rounded-circle bg-success" style={{ width: "12px", height: "12px" }}></div>
                                        <span className="small text-uppercase tracking-wide">Secure checkout</span>
                                    </div>
                                    <h3 className="fw-bold mb-3">Complete your enrollment</h3>
                                    <p className="text-white-50 mb-4">Your payment is protected with demo-grade encryption and a streamlined checkout experience.</p>
                                    <div className="card border-0 bg-white bg-opacity-10 p-3 mb-3">
                                        <div className="small text-white-50">Order summary</div>
                                        <div className="fw-semibold">{course.title}</div>
                                        <div className="text-success fw-bold mt-2">₹ {course.price}</div>
                                    </div>
                                </div>
                                <div className="small text-white-50">This is a simulated payment page for demo purposes.</div>
                            </div>

                            <div className="col-lg-7 p-4 p-lg-5 bg-white">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h4 className="fw-bold mb-1">Payment details</h4>
                                        <p className="text-muted mb-0">Enter your card details to continue.</p>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-success fw-semibold">
                                        <i className="bi bi-shield-lock-fill"></i>
                                        <span>Secure</span>
                                    </div>
                                </div>

                                <div className="border rounded-4 p-3 mb-4 bg-light">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-muted small">Accepted cards</span>
                                        <div className="fw-semibold">VISA • Mastercard</div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <div className="rounded-3 bg-dark d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: "52px", height: "32px", fontSize: "10px" }}>VISA</div>
                                        <div className="rounded-3 bg-primary d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: "52px", height: "32px", fontSize: "10px" }}>MC</div>
                                    </div>
                                </div>

                                {paymentSuccess && (
                                    <div className="alert alert-success py-2 mb-3">
                                        Payment successful. Your enrollment is complete.
                                    </div>
                                )}

                                <form onSubmit={handlePaymentSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Cardholder name</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            value={paymentForm.nameOnCard}
                                            onChange={(event) => setPaymentForm({ ...paymentForm, nameOnCard: event.target.value })}
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Card number</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            value={paymentForm.cardNumber}
                                            maxLength={12}
                                            inputMode="numeric"
                                            onChange={(event) => setPaymentForm({ ...paymentForm, cardNumber: event.target.value.replace(/\D/g, "") })}
                                            placeholder="123456789012"
                                        />
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-7">
                                            <label className="form-label fw-semibold">Expiry date</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                value={paymentForm.expiry}
                                                maxLength={5}
                                                placeholder="MM/YY"
                                                onChange={(event) => {
                                                    let value = event.target.value.replace(/\D/g, "").slice(0, 4);
                                                    if (value.length > 2) {
                                                        value = `${value.slice(0, 2)}/${value.slice(2)}`;
                                                    }
                                                    setPaymentForm({ ...paymentForm, expiry: value });
                                                }}
                                            />
                                        </div>
                                        <div className="col-5">
                                            <label className="form-label fw-semibold">CVV</label>
                                            <input
                                                type="password"
                                                className="form-control form-control-lg"
                                                value={paymentForm.cvv}
                                                maxLength={3}
                                                inputMode="numeric"
                                                onChange={(event) => setPaymentForm({ ...paymentForm, cvv: event.target.value.replace(/\D/g, "") })}
                                                placeholder="***"
                                            />
                                        </div>
                                    </div>

                                    {paymentError && <div className="alert alert-danger py-2 mb-3 mt-3">{paymentError}</div>}

                                    <div className="d-grid gap-2 mt-4">
                                        <button type="submit" className="btn btn-success btn-lg" disabled={processingPayment}>
                                            {processingPayment ? "Processing payment..." : `Pay ₹ ${course.price} & enroll`}
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPaymentPage(false)}>
                                            Back to course
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );

}

export default CourseDetails;