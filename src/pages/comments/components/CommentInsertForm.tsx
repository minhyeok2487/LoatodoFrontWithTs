import React, { FC, useState } from "react";

interface Props {
    handleSubmit:(text: any, parentId?: undefined) => Promise<void>
    initialText?:string
    submitLabel:string
    hasCancelButton?:boolean
    handleCancel?:() => Promise<void>
}

const CommentInsertForm:FC<Props> = ({handleSubmit, initialText, submitLabel, hasCancelButton, handleCancel}) => {
  // state 설정
  const [text, setText] = useState(initialText);
  const isTextareaDisabled = text?.length === 0; //작성내용이 없으면 버튼 클릭X

  //제출
  const onSubmit = (event:any) => {
    event.preventDefault();
    handleSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={onSubmit}>
      <textarea
        className="comment-form-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="방명록 남기기"
      />
      <button className="comment-form-button" disabled={isTextareaDisabled}>
        {submitLabel}
      </button>

      {/* 수정 시 취소 버튼 */}
      {hasCancelButton && (
        <button
          type="button"
          className="comment-form-button comment-form-cancel-button"
          onClick={handleCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default CommentInsertForm;
