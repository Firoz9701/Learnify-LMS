import { useEffect, useState } from "react";
import { getAllCoursesAllPages, getCourseImage } from "../services/courseService";
import { Link } from "react-router-dom";

function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("all");
    const [published, setPublished] = useState("true");
    const [price, setPrice] = useState("all");
    const [sortBy, setSortBy] = useState("latest");

    const fetchCourses = async (nextFilters) => {
        setLoading(true);

        try {
            const data = await getAllCoursesAllPages(nextFilters.sortBy, {
                search: nextFilters.searchTerm,
                category: nextFilters.category,
                published: nextFilters.published,
                price: nextFilters.price
            });

            setCourses(data || []);
        } catch (error) {
            console.error(error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses({ searchTerm, category, published, price, sortBy });
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        setSearchTerm(query.trim());

        fetchCourses({
            searchTerm: query.trim(),
            category,
            published,
            price,
            sortBy
        });
    };

    const handleApplyFilters = () => {
        fetchCourses({ searchTerm, category, published, price, sortBy });
    };

    const handleReset = () => {
        const defaults = {
            searchTerm: "",
            category: "all",
            published: "true",
            price: "all",
            sortBy: "latest"
        };

        setQuery("");
        setSearchTerm(defaults.searchTerm);
        setCategory(defaults.category);
        setPublished(defaults.published);
        setPrice(defaults.price);
        setSortBy(defaults.sortBy);

        fetchCourses(defaults);
    };

    const categoryOptions = Array.from(
        new Set(
            courses
                .map((course) => course.category)
                .filter((value) => typeof value === "string" && value.trim().length > 0)
                .map((value) => value.trim())
        )
    );

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div>
                    <p className="text-primary fw-semibold mb-1">Explore courses</p>
                    <h2 className="mb-0">All Courses</h2>
                    <p className="text-muted mt-2 mb-0">Browse the full library of Learnify courses with richer visuals and modern cards.</p>
                </div>
                <Link to="/" className="btn btn-outline-secondary rounded-pill">
                    Back to home
                </Link>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <form onSubmit={handleSearch} className="row g-3 align-items-end mb-3">
                        <div className="col-md-8">
                            <label className="form-label text-muted small mb-1">Search by title or category</label>
                            <input
                                type="text"
                                className="form-control"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Try: React, Java, Docker..."
                            />
                        </div>
                        <div className="col-md-4 d-grid">
                            <button type="submit" className="btn btn-primary">
                                Search
                            </button>
                        </div>
                    </form>

                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label text-muted small mb-1">Category</label>
                            <select
                                className="form-select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="all">All categories</option>
                                {categoryOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label text-muted small mb-1">Published</label>
                            <select
                                className="form-select"
                                value={published}
                                onChange={(e) => setPublished(e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="true">Published</option>
                                <option value="false">Unpublished</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label text-muted small mb-1">Price</label>
                            <select
                                className="form-select"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            >
                                <option value="all">All prices</option>
                                <option value="free">Free</option>
                                <option value="paid">Paid</option>
                                <option value="under-1000">Under ₹1000</option>
                                <option value="1000-3000">₹1000 - ₹3000</option>
                                <option value="above-3000">Above ₹3000</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label text-muted small mb-1">Sort</label>
                            <select
                                className="form-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="latest">Latest</option>
                                <option value="popular">Popular</option>
                            </select>
                        </div>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                        <button type="button" className="btn btn-outline-primary" onClick={handleApplyFilters}>
                            Apply Filters
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="border rounded-4 p-4 bg-light-subtle text-muted">Loading courses...</div>
            ) : courses.length === 0 ? (
                <div className="border rounded-4 p-4 bg-light-subtle">
                    <h6 className="fw-semibold mb-1">No matching courses found</h6>
                    <p className="text-muted mb-0">Try changing search text, category, price filter, or sort option.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {courses.map((course) => (
                        <div className="col-md-6 col-lg-4" key={course.id}>
                            <div className="card h-100 border-0 shadow-sm course-card">
                                <div className="course-image-wrapper">
                                    <img
                                        src={getCourseImage(course)}
                                        alt={course.title}
                                        className="card-img-top course-banner"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/images/reactjs.png";
                                        }}
                                    />
                                </div>
                                <div className="card-body p-4">
                                    <span className="badge rounded-pill bg-light text-primary mb-3">{course.category || "Learning"}</span>
                                    <h5 className="fw-bold">{course.title}</h5>
                                    <p className="text-muted mt-2">{course.description}</p>
                                </div>
                                <div className="card-footer bg-transparent border-0 px-4 pb-4 pt-0 d-flex justify-content-between align-items-center">
                                    <span className="fw-semibold text-dark">
                                        {Number(course.price || 0) > 0 ? `₹ ${course.price}` : "Free"}
                                    </span>
                                    <Link to={`/courses/${course.id}`} className="btn btn-primary btn-sm rounded-pill">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Courses;