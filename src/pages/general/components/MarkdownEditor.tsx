import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import { Editor } from "@toast-ui/react-editor";
import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import styled from "styled-components";

import { themeAtom } from "@core/atoms/theme.atom";
import useToastUiDarkMode from "@core/hooks/useToastUiDarkMode";

type Props = {
  value: string;
  onChange: (markdown: string) => void;
  height?: string;
  placeholder?: string;
};

const MarkdownEditor = ({ value, onChange, height = "260px", placeholder = "" }: Props) => {
  const editorRef = useRef<Editor | null>(null);
  const theme = useAtomValue(themeAtom);

  useToastUiDarkMode();

  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();

    if (!editorInstance) {
      return;
    }

    const currentMarkdown = editorInstance.getMarkdown();

    if (currentMarkdown !== (value || "")) {
      editorInstance.setMarkdown(value || "");
    }

    if (placeholder && typeof editorInstance.setPlaceholder === "function") {
      editorInstance.setPlaceholder(placeholder);
    }
  }, [value, placeholder]);

  const handleChange = () => {
    const markdown = editorRef.current?.getInstance().getMarkdown();

    if (markdown === undefined) {
      return;
    }

    onChange(markdown);
  };

  return (
    <EditorWrapper $height={height}>
      <Editor
        ref={editorRef}
        initialValue={value || ""}
        previewStyle="tab"
        height={height}
        initialEditType="markdown"
        hideModeSwitch
        useCommandShortcut={false}
        language="ko-KR"
        plugins={[colorSyntax]}
        onChange={handleChange}
        toolbarItems={toolbarItems}
        theme={theme === "dark" ? "dark" : "default"}
      />
    </EditorWrapper>
  );
};

export default MarkdownEditor;

const toolbarItems = [
  ["heading", "bold", "italic", "strike"],
  ["hr", "quote"],
  ["ul", "ol", "task"],
  ["link", "code", "codeblock"],
];

const EditorWrapper = styled.div<{ $height: string }>`
  width: 100%;
  .toastui-editor-defaultUI {
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.app.border};
    overflow: hidden;
  }

  .toastui-editor-md-container,
  .toastui-editor-ww-container {
    min-height: ${({ $height }) => $height};
  }

  .toastui-editor-defaultUI-toolbar {
    border-bottom: 1px solid ${({ theme }) => theme.app.border};
  }
`;
