import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/ui/pages/App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Force update latest version
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  let refreshing: boolean = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  navigator.serviceWorker
    .register("/sw.js")
    .then((registration: ServiceWorkerRegistration) => {
      registration.addEventListener("updatefound", () => {
        const newWorker: ServiceWorker | null = registration.installing;

        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            if (confirm("New version available. Do you want to update?")) {
              newWorker.postMessage({ type: "SKIP_WAITING" });
            }
          }
        });
      });
    });
}
