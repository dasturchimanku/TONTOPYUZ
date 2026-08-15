const TOKEN_KEY = "oynur_admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY) || "";
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(url, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
    const token = getToken();
    if (token) headers["Authorization"] = "Bearer " + token;

    const res = await fetch(url, { ...options, headers });
    let data = null;
    try {
        data = await res.json();
    } catch {
        /* empty */
    }
    if (!res.ok) throw new Error(data?.error || "So'rov xatosi (" + res.status + ")");
    return data;
}

export const api = {
    site: () => request("/api/site"),
    estimate: (payload) => request("/api/estimate", { method: "POST", body: JSON.stringify(payload) }),

    login: (password) => request("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) }),
    logout: () => request("/api/admin/logout", { method: "POST" }),
    overview: () => request("/api/admin/overview"),

    upload: (file) => {
        const fd = new FormData();
        fd.append("image", file);
        return request("/api/admin/upload", { method: "POST", body: fd });
    },

    services: {
        list: () => request("/api/admin/services"),
        create: (d) => request("/api/admin/services", { method: "POST", body: JSON.stringify(d) }),
        update: (id, d) => request("/api/admin/services/" + id, { method: "PUT", body: JSON.stringify(d) }),
        remove: (id) => request("/api/admin/services/" + id, { method: "DELETE" }),
    },
    works: {
        list: () => request("/api/admin/works"),
        create: (d) => request("/api/admin/works", { method: "POST", body: JSON.stringify(d) }),
        update: (id, d) => request("/api/admin/works/" + id, { method: "PUT", body: JSON.stringify(d) }),
        remove: (id) => request("/api/admin/works/" + id, { method: "DELETE" }),
    },
    leads: {
        list: () => request("/api/admin/leads"),
        update: (id, d) => request("/api/admin/leads/" + id, { method: "PUT", body: JSON.stringify(d) }),
        remove: (id) => request("/api/admin/leads/" + id, { method: "DELETE" }),
    },
    settings: {
        get: () => request("/api/admin/settings"),
        update: (d) => request("/api/admin/settings", { method: "PUT", body: JSON.stringify(d) }),
    },
};
