import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { App } from "./App";
import { SocketContextProvider } from "./contexts";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <SocketContextProvider>
      <App />
    </SocketContextProvider>
  </React.StrictMode>
);
