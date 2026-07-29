import { Link } from "react-router-dom";

function CTASection() {
    return (
        <section className="py-5">
            <div className="container">
                <div className="cta-card rounded-4 p-4 p-lg-5 text-center">
                    <h2 className="h3 fw-bold">Ready to level up your learning?</h2>
                    <p className="text-muted mt-2 mb-4">
                        Start your journey with Learnify today and unlock a more focused, modern way of studying.
                    </p>
                    <Link to="/register" className="btn btn-light btn-lg rounded-pill px-4 text-primary fw-semibold">
                        Join Now
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default CTASection;