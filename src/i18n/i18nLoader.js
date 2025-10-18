export default async function loadLang(lang) {
    try {
        const res = await fetch(`/i18n/${lang}.json`);
        return await res.json();
    } catch (e) {
        console.error("Language load error:", e);
        return {};
    }
}
