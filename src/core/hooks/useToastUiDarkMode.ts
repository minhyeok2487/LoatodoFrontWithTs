import { useAtomValue } from "jotai";
import { useEffect } from "react";

import { themeAtom } from "@core/atoms/theme.atom";

export default () => {
  const theme = useAtomValue(themeAtom);

  useEffect(() => {
    const editorDom = document.querySelector(".toastui-editor-defaultUI");

    if (theme === "dark") {
      if (editorDom) {
        editorDom.classList.add("toastui-editor-dark");
      } else {
        const viewerDom = document.querySelector(".toastui-editor-default");
        viewerDom?.classList.add("toastui-editor-dark");
        viewerDom?.classList.remove("toastui-editor-default");
      }
    } else {
      if (editorDom && editorDom.classList.contains("toastui-editor-dark")) {
        editorDom.classList.remove("toastui-editor-dark");
      } else {
        const viewerDom = document.querySelector(".toastui-editor-dark");
        viewerDom?.classList.add("toastui-editor-default");
        viewerDom?.classList.remove("toastui-editor-dark");
      }
    }
  }, [theme]);
};
