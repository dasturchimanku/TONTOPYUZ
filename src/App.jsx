import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";

export default function App() {
    return (
        <ThemeProvider>
            <LangProvider>
                <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <Home />
                    <Footer />
                </div>
            </LangProvider>
        </ThemeProvider>
    );
}
