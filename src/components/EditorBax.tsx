import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import React, { FC, useRef } from 'react';
import { uploadImage } from '../core/apis/Image.api';

interface Props {
  setContent: React.Dispatch<React.SetStateAction<string>>;
  addFileNames: (fileName: string) => void;
}

const EditorBax: FC<Props> = ({ setContent, addFileNames }) => {
  const editorRef = useRef<Editor>(null);

  const onChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.getInstance().getHTML());
    }
  };

  const onUploadImage = async (blob: Blob, callback: (url: string, altText: string) => void) => {
    try {
      const data = await uploadImage(blob); 
      addFileNames(data.fileName);
      callback(data.url, 'alt text');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="edit_wrap">
      <Editor
        initialValue=" "
        previewStyle="vertical"
        height="600px"
        initialEditType="wysiwyg"
        hideModeSwitch={true}
        useCommandShortcut={false}
        language="ko-KR"
        ref={editorRef}
        plugins={[colorSyntax]}
        onChange={onChange}
        hooks={{ addImageBlobHook: onUploadImage }}
      />
    </div>
  );
};

export default EditorBax;
