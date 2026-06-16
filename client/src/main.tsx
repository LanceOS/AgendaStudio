import React from "react";
import ReactDOM from "react-dom/client";
import { applyThemePreference } from "@calendar/library/utilities/themeEngine";
import App from "./App";

applyThemePreference('system');

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
