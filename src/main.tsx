import { StrictMode } from "react";

import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App.tsx";
import AuthenticateUser from "./components/shared/authenticate-user.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import "./index.css";
import { QueryClientProvider } from "./provider/query-client.provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <NuqsAdapter>
        <QueryClientProvider>
          <ThemeProvider>
            <App />
            <Toaster
              richColors
              swipeDirections={["right", "left", "top"]}
              position="top-center"
            />
            <AuthenticateUser />
          </ThemeProvider>
        </QueryClientProvider>
      </NuqsAdapter>
    </BrowserRouter>
  </StrictMode>
);
