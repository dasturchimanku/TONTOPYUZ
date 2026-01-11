export default function BuySellTabs({ mode, setMode, t }) {
    return (
        <div className="flex gap-2 mb-6">
            {["buy", "sell"].map((m) => (
                <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`tab ${mode === m ? "tab-active" : ""}`}
                >
                    {t[m]}
                </button>
            ))}
        </div>
    );
}
