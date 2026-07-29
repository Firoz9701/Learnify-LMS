import { Link } from "react-router-dom";

function CTASection() {

    return (

        <section className="py-5">

            <div className="container">

                <div className="cta-card rounded-4 p-5 text-center">

                    <h2 className="fw-bold mb-3">
                        Start Your Learning Journey Today
                    </h2>

                    <p className="mb-4">
                        Create your free Learnify account and enroll in industry-ready courses
                        to build real-world skills at your own pace.
                    </p>

                    <Link
                        to="/register"
                        className="btn btn-light btn-lg rounded-pill"
                    >

                        Enroll Now

                    </Link>

                </div>

            </div>

        </section>

    );

}

export default CTASection;