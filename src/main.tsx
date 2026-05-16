import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/react";

import App from "./App";
import { clerkPublishableKey } from "./auth/clerk";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);
