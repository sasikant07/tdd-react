import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

async function deferRender() {
  const { worker } = await import("./mocks/server.js");
  return worker.start();
}

deferRender().then(() => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
