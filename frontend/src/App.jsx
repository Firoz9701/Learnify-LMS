import { BrowserRouter } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <div className="container mt-4">
                <AppRoutes />
            </div>

            <Footer />
        </BrowserRouter>
    );
}

export default App;