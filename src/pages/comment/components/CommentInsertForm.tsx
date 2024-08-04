import { FC, FormEvent, useState } from "react";
import styled, { css } from "styled-components";

import Button from "@components/Button";

interface Props {
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  initialText?: string;
  hasCancelButton?: boolean;
  placeholder?: string;
  submitLabel: string;
}

const CommentInsertForm: FC<Props> = ({
  onSubmit,
  onCancel,
  hasCancelButton,
  initialText = "",
  placeholder = "방명록 남기기",
  submitLabel,
}) => {
  // state 설정
  const [text, setText] = useState(initialText);
  const isTextareaDisabled = text?.length === 0; // 작성내용이 없으면 버튼 클릭X

  // 제출
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    onSubmit(text);
    setText("");
  };

  return (
    <Wrapper onSubmit={handleSubmit}>
      <TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
      />
      <Button css={buttonCss} type="submit" disabled={isTextareaDisabled}>
        {submitLabel}
      </Button>

      {hasCancelButton && (
        <Button css={buttonCss} type="button" onClick={onCancel}>
          취소하기
        </Button>
      )}
    </Wrapper>
  );
};

export default CommentInsertForm;

const Wrapper = styled.form`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 8px;
`;

const TextArea = styled.textarea`
  flex: 1;
  padding: 16px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  font-weight: 700;
  background: ${({ theme }) => theme.app.bg.main};
  color: ${({ theme }) => theme.app.text.dark2};
`;

const buttonCss = css`
  align-self: stretch;
  padding: 0 25px;
  border-radius: 10px;
`;

/* const Button = styled.button`
  align-self: stretch;
  padding: 0 25px;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.dark2};
  background: ${({ theme }) => theme.app.bg.main};
`; */
