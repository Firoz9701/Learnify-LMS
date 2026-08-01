import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles = [] }) {

    const { user } = useContext(AuthContext);

    const location = useLocation();

    if (!user) {

        return (
            <Navigate
                to="/"
                state={{ from: location }}
                replace
            />
        );

    }

    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user.role)
    ) {

        return <Navigate to="/" replace />;

    }

    return children;

}

export default ProtectedRoute;