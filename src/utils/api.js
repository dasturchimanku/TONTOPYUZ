const API_BASE = "https://6899d9e381ab8.xvest5.ru/herex_backend"; // ← o'zingizning hosting manzilingizni yozing

export async function createPayment(service, username, amount, priceUZS) {
    try {
        const response = await fetch(`${API_BASE}/index.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ service, username, amount, priceUZS }),
        });
        return await response.json();
    } catch (err) {
        console.error("Payment create error:", err);
        return { error: "Server error" };
    }
}

export async function getPaymentStatus(id) {
    try {
        const res = await fetch(`${API_BASE}/index.php?id=${id}`);
        return await res.json();
    } catch (err) {
        console.error("Status error:", err);
        return null;
    }
}
