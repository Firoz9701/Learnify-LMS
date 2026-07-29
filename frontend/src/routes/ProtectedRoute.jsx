import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function ProtectedRoute({ children }) {

    const { user } = useContext(AuthContext);
    const location = useLocation();

    console.log("ProtectedRoute:", location.pathname);
    console.log("User:", user);

    if (!user) {
        console.log("Redirecting to login...");
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;