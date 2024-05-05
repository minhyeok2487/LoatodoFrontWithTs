import React from "react";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RecoilRoot } from "recoil";
import { createRoot, hydrateRoot } from "react-dom/client";


const rootElement = document.getElementById("root") as HTMLElement;

const queryClient = new QueryClient();

const element = (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <App />
        <ReactQueryDevtools />
      </RecoilRoot>
    </QueryClientProvider>
  </React.StrictMode>
);


if (rootElement.hasChildNodes()){
  hydrateRoot(rootElement, element);
} else {
  const root = createRoot(rootElement);
  root.render(element);
}

reportWebVitals();
