import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const defaultRegionId = window.location.hash.split("#")[1] || null;
// Remove the hash
window.history.pushState("", document.title, window.location.pathname + window.location.search);

root.render(
  <React.StrictMode>
    <App defaultRegionId={defaultRegionId} />
  </React.StrictMode>
);

serviceWorkerRegistration.unregister();
