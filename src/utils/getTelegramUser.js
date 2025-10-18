export async function getTelegramUser(username) {
    try {
        const cleanUsername = username.replace("@", "").trim();
        if (!cleanUsername) return null;

        const response = await fetch("https://fragment-api.net/getUserInfo", {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: cleanUsername,
                fragment_cookies:
                    "c3RlbF9zc2lkPTlmZDVhMzdlNWFhNWU2ZTA5Yl8yNDk1MTYwMzEyNzE5NTk4NTYwOyBzdGVsX2R0PS0xODA7IHN0ZWxfdG9rZW49OTMyYmFmNWE4ZTA3NzU1YmZiOThiOTU2M2Y2YzAzODE5MzJiYWY0MDkzMmJhZTNiZDE2YWMwNGJmNmRiYjgyMmI3YzgyOyBzdGVsX3Rvbl90b2tlbj1WNHl0NGtSUGVuZ1lPNEN4NkhBc2ZDZjY3NXdLQU52SGphN2t4OFBKN1cyeWhYWWE2aTJqRGo5ZExGcXhnNGE4NUtDRzZkUEQ1TXBYNUlxcHpJTTV2d3NIcl9fWVN6ZkdaRkxlcDlkbmMwa2FabTVJTHFuUkd1cVl1UWZWWlRHTV9aWmtnYWFHcTRRTUJIR014MUVIbWctem9wYVNOeGFDTlNUcllUcXYwS2dKbUZjNGdwODZCSE1lTHpZSUdPaXlBQkxwSTNTOQ==",
            }),
        });

        const data = await response.json();
        console.log("Fragment API response:", data);

        if (data?.success && data?.found) {
            // photo HTML tagdan URL ni ajratamiz
            let photoUrl = null;
            if (data.photo) {
                const match = data.photo.match(/src="([^"]+)"/);
                photoUrl = match ? match[1] : null;
            }

            return {
                name: data.name || cleanUsername,
                username: data.username || cleanUsername,
                photo: photoUrl,
            };
        } else {
            return null;
        }
    } catch (err) {
        console.error("Telegram user fetch error:", err);
        return null;
    }
}
