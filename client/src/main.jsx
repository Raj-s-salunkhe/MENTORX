import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./App.css";

import App from "./App.jsx";
import LoadingScreen from "./LoadingScreen.jsx";


function Root() {

    const [loading, setLoading] = useState(true);

    return loading ? (

        <LoadingScreen
            onComplete={() => setLoading(false)}
        />

    ) : (

        <App />

    );
}


createRoot(
    document.getElementById("root")
).render(

    <StrictMode>
        <Root />
    </StrictMode>

);