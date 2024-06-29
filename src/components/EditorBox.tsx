import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import { Editor } from "@toast-ui/react-editor";
import React, { useRef } from "react";
import type { FC } from "react";
import { useRecoilValue } from "recoil";

import { themeAtom } from "@core/atoms/theme.atom";
import useUploadImage from "@core/hooks/mutations/image/useUploadImage";
import useToastUiDarkMode from "@core/hooks/useToastUiDarkMode";

interface Props {
  setContent: React.Dispatch<React.SetStateAction<string>>;
  addFileNames: (fileName: string) => void;
}

const EditorBox: FC<Props> = ({ setContent, addFileNames }) => {
  const editorRef = useRef<Editor>(null);

  const theme = useRecoilValue(themeAtom);

  const uploadImage = useUploadImage();

  useToastUiDarkMode();

  const onChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.getInstance().getHTML());
    }
  };

  const onUploadImage = async (
    blob: Blob,
    callback: (url: string, altText: string) => void
  ) => {
    try {
      const data = await uploadImage.mutateAsync(blob);

      addFileNames(data.fileName);
      callback(data.url, "alt text");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Editor
      ref={editorRef}
      initialValue=" "
      previewStyle="vertical"
      height="600px"
      initialEditType="wysiwyg"
      hideModeSwitch
      useCommandShortcut={false}
      language="ko-KR"
      plugins={[colorSyntax]}
      onChange={onChange}
      hooks={{ addImageBlobHook: onUploadImage }}
      // toastui 컴포넌트 theme값은 최초 렌더링 시에만 반영 되는 이슈가 있어 useToastUiDarkMode 커스텀 훅 사용
      theme={theme === "dark" ? "dark" : "default"}
    />
  );
};

export default EditorBox;
