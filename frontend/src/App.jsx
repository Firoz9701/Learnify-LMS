import { BrowserRouter } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";

function App() {
    return (
        <BrowserRouter>

            <div className="d-flex flex-column min-vh-100">

                <Navbar />

                <main className="container mt-4 flex-grow-1">

                    <AppRoutes />

                </main>

                <Footer />

            </div>

        </BrowserRouter>
    );
}

export default App;