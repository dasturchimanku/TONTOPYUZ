import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";

function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow px-4 sm:px-6 pt-16 sm:pt-0">
                {children}
            </main>
            <Footer />
        </div>
    );
}

// 🔐 Admin sahifalariga kirish uchun guard
function PrivateRoute({ children }) {
    const token = localStorage.getItem("admin_token");
    const expires = parseInt(localStorage.getItem("admin_expires")) || 0;
    const now = Math.floor(Date.now() / 1000);

    if (!token || now > expires) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_expires");
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
                        {/* 🔑 Admin Login */}
                        <Route path="/admin/login" element={<AdminLogin />} />

                        {/* 🔒 Admin Dashboard */}
                        <Route
                            path="/admin"
                            element={
                                <PrivateRoute>
                                    <AdminDashboard />
                                </PrivateRoute>
                            }
                        />

                        {/* 🌍 Asosiy sahifalar */}
                        <Route
                            path="/"
                            element={
                                <Layout>
                                    <Home />
                                </Layout>
                            }
                        />

                        {/* ❌ Not found => Home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </LangProvider>
        </ThemeProvider>
    );
}
