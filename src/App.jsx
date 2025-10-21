import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function PrivateRoute({ children }) {
    const token = localStorage.getItem("admin_token");
    const expires = parseInt(localStorage.getItem("admin_expires") || "0", 10);
    const now = Math.floor(Date.now() / 1000);

    if (!token || now > expires) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_expires");
        localStorage.removeItem("admin_user");
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

export default function App() {
    return (
        <ThemeProvider>
            <LangProvider>
                <Router>
                    <Routes>
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route
                            path="/admin"
                            element={
                                <PrivateRoute>
                                    <AdminDashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="*"
                            element={
                                <div className="min-h-screen flex flex-col">
                                    <Navbar />
                                    <main className="flex-grow px-4 sm:px-6 pt-16 sm:pt-0">
                                        <Home />
                                    </main>
                                    <Footer />
                                </div>
                            }
                        />
                    </Routes>
                </Router>
            </LangProvider>
        </ThemeProvider>
    );
}
