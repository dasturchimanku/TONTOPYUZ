// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("admin_token"); // yoki sessionStorage

    return token ? children : <Navigate to="/admin/login" replace />;
}
