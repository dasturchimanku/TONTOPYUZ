export default function Header({ lang, setLang, themeMode, setThemeMode }) {
    return (
        <header className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-[var(--card)]/70 border-b border-[var(--border)]">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold logo-text logo-hover">
                    tontopy.uz
                </h1>

                <div className="flex gap-3">
                    <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        className="select text-xs"
                    >
                        <option value="uz">UZ</option>
                        <option value="ru">RU</option>
                        <option value="en">EN</option>
                    </select>

                    <select
                        value={themeMode}
                        onChange={(e) => setThemeMode(e.target.value)}
                        className="select text-xs"
                    >
                        <option value="system">System</option>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                    </select>
                </div>
            </div>
        </header>
    );
}
