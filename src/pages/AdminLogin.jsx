import React, { useState } from "react";
import { adminLogin } from "../utils/adminApi";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const nav = useNavigate();

    const handle = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await adminLogin(username, password);
        setLoading(false);

        if (res.success) {
            const expiresAt = Math.floor(Date.now() / 1000) + 5 * 60 * 60; // ⏰ 5 soat

            localStorage.setItem("admin_token", res.token);
            localStorage.setItem("admin_expires", expiresAt);
            localStorage.setItem("admin_user", res.username);

            nav("/admin");
        } else {
            setError(res.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <form
                onSubmit={handle}
                className="w-full max-w-md p-6 rounded-2xl bg-white/60 dark:bg-black/50 backdrop-blur-lg border border-white/20"
            >
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Admin login
                </h2>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <input
                    className="w-full mb-3 p-3 rounded-xl bg-white/10"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    className="w-full mb-3 p-3 rounded-xl bg-white/10"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    disabled={loading}
                    className="w-full py-2 rounded-xl bg-blue-600 text-white"
                >
                    {loading ? "Loading..." : "Login"}
                </button>
            </form>
        </div>
    );
}
