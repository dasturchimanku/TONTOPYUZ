import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import PaymentSuccess from "./pages/PaymentSuccess";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";

export default function App() {
    return (
        <ThemeProvider>
            <LangProvider>
                <Router>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />

                        <main className="flex-grow">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route
                                    path="/payment-success"
                                    element={<PaymentSuccess />}
                                />
                            </Routes>
                        </main>

                        <Footer />
                    </div>
                </Router>
            </LangProvider>
        </ThemeProvider>
    );
}
