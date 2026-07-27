import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

import { login } from "../../services/authService";
function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const { loginUser } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await login(formData);

            loginUser(
                response.data.user,
                response.data.token
            );

            navigate("/student");

            console.log("Login Successful");

            console.log(localStorage.getItem("token"));

        }
        catch (error) {

            console.error(error.response?.data);

        }

    };

    return (

        <div className="row justify-content-center">

            <div className="col-md-5">

                <div className="card shadow">

                    <div className="card-body">

                        <h2 className="text-center mb-4">
                            Login
                        </h2>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">

                                <label className="form-label">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <button
                                className="btn btn-primary w-100"
                                type="submit">

                                Login

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;