import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

dayjs.locale("ko");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

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

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, element);
} else {
  const root = createRoot(rootElement);
  root.render(element);
}

reportWebVitals();
