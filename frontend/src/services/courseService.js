import api from "./api";

export const getAllCourses = async (page = 0, size = 12, sortBy = "id") => {
    const response = await api.get("/courses", {
        params: { page, size, sortBy }
    });

    return response.data.content;
};

export const getCourseImage = (course) => {
    const title = (course?.title || "").toLowerCase();

    // If backend provides a thumbnail or image URL, prefer it — but map
    // backend-local paths to our frontend assets when possible to avoid missing files.
    if (course?.thumbnail) {
        const thumb = course.thumbnail.trim();

        // If it's a full URL, return directly
        if (/^https?:\/\//i.test(thumb)) return thumb;

        // If it's a simple filename (no slashes), map to /images/<name>
        if (!thumb.includes("/")) return `/images/${thumb}`;

        // If it's a backend-local path like '/images/java.jpg', try to map to our known images
        const parts = thumb.split("/").filter(Boolean);
        const filename = parts.length ? parts[parts.length - 1] : thumb;
        const base = filename.replace(/\.(jpg|jpeg|png|webp)$/i, "").toLowerCase();

        // Try to map base to a known imageMap key (e.g., 'springboot' -> 'spring')
        const imageMap = {
            java: "/images/java.png",
            spring: "/images/spring.png",
            react: "/images/reactjs.png",
            python: "/images/python.png",
            docker: "/images/docker.png",
            sql: "/images/sql.png",
            node: "/images/nodejs.png",
            html: "/images/htmlcss.png",
            dsa: "/images/dsa.png",
            system: "/images/systemdesign.png",
            git: "/images/git.png",
            aws: "/images/aws.png"
        };

        for (const key of Object.keys(imageMap)) {
            if (base === key || base.includes(key) || key.includes(base)) return imageMap[key];
        }

        // Best-effort: switch extension to .png in frontend images folder
        return `/images/${base}.png`;
    }

    const imageMap = {
        java: "/images/java.png",
        spring: "/images/spring.png",
        react: "/images/reactjs.png",
        python: "/images/python.png",
        docker: "/images/docker.png",
        sql: "/images/sql.png",
        node: "/images/nodejs.png",
        html: "/images/htmlcss.png",
        dsa: "/images/dsa.png",
        system: "/images/systemdesign.png",
        git: "/images/git.png",
        aws: "/images/aws.png"
    };

    // Prefer whole-word matches to avoid accidental partial hits (e.g. 'react' vs 'crate')
    const normalized = title.replace(/[^a-z0-9]+/g, " ").trim();
    const words = new Set(normalized.split(/\s+/));

    // Check keys by word membership first
    for (const key of Object.keys(imageMap)) {
        if (words.has(key)) return imageMap[key];
    }

    // Fallback to substring match (keeps previous behaviour)
    for (const [key, imagePath] of Object.entries(imageMap)) {
        if (title.includes(key)) return imagePath;
    }

    return "/images/reactjs.png";
};


export const getCourseById = async (id) => {

    const response = await api.get(`/courses/${id}`);

    return response.data;
};


export const createCourse = async (course) => {

    const response = await api.post("/courses", course);

    return response.data;
};


export const updateCourse = async (id, course) => {

    const response = await api.put(`/courses/${id}`, course);

    return response.data;
};


export const deleteCourse = async (id) => {

    await api.delete(`/courses/${id}`);

};