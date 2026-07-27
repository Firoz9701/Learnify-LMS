import { useState } from "react";
import AuthContext from "./AuthContext";

function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {

        const storedUser = localStorage.getItem("user");

        return storedUser ? JSON.parse(storedUser) : null;

    });

    const loginUser = (userData, token) => {

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);

    };

    const logoutUser = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loginUser,
                logoutUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;