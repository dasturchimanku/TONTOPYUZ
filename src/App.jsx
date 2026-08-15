import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Services from "./components/Services.jsx";
import Works from "./components/Works.jsx";
import Estimator from "./components/Estimator.jsx";
import Footer from "./components/Footer.jsx";
import { api } from "./api.js";

export default function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        api.site().then(setData).catch(console.error);
    }, []);

    const settings = data?.settings || {};
    const services = data?.services || [];
    const works = data?.works || [];

    return (
        <div className="min-h-screen bg-white">
            <Navbar phone={settings.phone} logo={settings.logo} />
            <Hero tagline={settings.heroTagline} />
            <Services services={services} />
            <Works works={works} />
            <Estimator services={services} currency={settings.currency || "€"} />
            <Footer settings={settings} />
        </div>
    );
}
