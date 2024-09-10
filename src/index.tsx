import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@toast-ui/editor/dist/i18n/ko-kr";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localeData from "dayjs/plugin/localeData";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import { createRoot, hydrateRoot } from "react-dom/client";

import { STALE_TIME_MS } from "@core/constants";
import queryClient from "@core/lib/queryClient";

import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import "react-toastify/dist/ReactToastify.css";
import "tui-color-picker/dist/tui-color-picker.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

dayjs.locale("ko");
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.tz.setDefault("Asia/Seoul");

const rootElement = document.getElementById("root") as HTMLElement;

const element = (
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools />
  </QueryClientProvider>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, element);
} else {
  const root = createRoot(rootElement);
  root.render(element);
}

reportWebVitals();
