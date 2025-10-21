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

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
    return (
        <ThemeProvider>
            <LangProvider>
                <Router>
                    <div className="min-h-screen flex flex-col">
                        {/* Admin sahifalarida Navbar/Footer chiqmasin */}
                        <Routes>
                            <Route
                                path="/admin/login"
                                element={<AdminLogin />}
                            />
                            <Route path="/admin" element={<AdminDashboard />} />

                            {/* Default front UI */}
                            <Route
                                path="*"
                                element={
                                    <div className="flex flex-col min-h-screen">
                                        <Navbar />
                                        <main className="flex-grow px-4 sm:px-6 pt-16 sm:pt-0">
                                            <Routes>
                                                <Route
                                                    path="/"
                                                    element={<Home />}
                                                />
                                                <Route
                                                    path="*"
                                                    element={
                                                        <Navigate
                                                            to="/"
                                                            replace
                                                        />
                                                    }
                                                />
                                            </Routes>
                                        </main>
                                        <Footer />
                                    </div>
                                }
                            />
                        </Routes>
                    </div>
                </Router>
            </LangProvider>
        </ThemeProvider>
    );
}
