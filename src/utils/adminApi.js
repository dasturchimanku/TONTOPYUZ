const API_BASE = "https://6899d9e381ab8.xvest5.ru/api/admin";
function authHeader() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminLogin(username, password) {
    const res = await fetch(`${API_BASE}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    return res.json();
}

export async function adminLogout() {
    const res = await fetch(`${API_BASE}/logout.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
    });
    return res.json();
}

export async function getPrices() {
    const res = await fetch(`${API_BASE}/prices.php`, {
        headers: { ...authHeader() },
    });
    return res.json();
}

export async function updatePrice(id, unit_price) {
    const res = await fetch(`${API_BASE}/update_price.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ id, unit_price }),
    });
    return res.json();
}

export async function getPayments(page = 1, pageSize = 20, q = "") {
    const qs = new URLSearchParams({ page, pageSize, q });
    const res = await fetch(`${API_BASE}/payments.php?${qs.toString()}`, {
        headers: { ...authHeader() },
    });
    return res.json();
}

export async function updatePaymentStatus(id, status) {
    const res = await fetch(`${API_BASE}/update_payment_status.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ id, status }),
    });
    return res.json();
}
