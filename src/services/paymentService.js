export async function createPayment({
    address,
    amount,
    priceUZS,
    paymentMethod,
}) {
    try {
        const url =
            paymentMethod === "click"
                ? "https://6899d9e381ab8.xvest5.ru/tontopy/create-click-payment.php"
                : "https://6899d9e381ab8.xvest5.ru/tontopy/create-card-payment.php";

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address, amount, priceUZS }),
        });

        const data = await res.json();
        return data;
    } catch (e) {
        console.error(e);
        return { success: false, error: "Network error" };
    }
}
