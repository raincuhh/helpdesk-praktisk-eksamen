import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
	document.documentElement.classList.add("dark");
} else {
	document.documentElement.classList.remove("dark");
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
	if (e.matches) {
		document.documentElement.classList.add("dark");
	} else {
		document.documentElement.classList.remove("dark");
	}
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
