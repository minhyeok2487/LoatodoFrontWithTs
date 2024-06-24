import styled from "@emotion/styled";
import { FC, useState } from "react";

interface Props {
  handleSubmit: (text: any) => void;
  initialText?: string;
  submitLabel: string;
  hasCancelButton?: boolean;
  handleCancel?: any;
  placeholder?: string;
}

const CommentInsertForm: FC<Props> = ({
  handleSubmit,
  initialText,
  submitLabel,
  hasCancelButton,
  handleCancel,
  placeholder,
}) => {
  // state 설정
  const [text, setText] = useState(initialText);
  const isTextareaDisabled = text?.length === 0; // 작성내용이 없으면 버튼 클릭X

  // 제출
  const onSubmit = (event: any) => {
    event.preventDefault();
    handleSubmit(text);
    setText("");
  };

  return (
    <Wrapper onSubmit={onSubmit}>
      <TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder || "방명록 남기기"}
      />
      <Button type="submit" disabled={isTextareaDisabled}>
        {submitLabel}
      </Button>

      {/* 수정 시 취소 버튼 */}
      {hasCancelButton && (
        <Button type="button" onClick={handleCancel}>
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
  align-items: center;
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

  &::placeholder {
  }
`;

const Button = styled.button`
  align-self: stretch;
  padding: 0 25px;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.dark2};
  background: ${({ theme }) => theme.app.bg.main};
  border-radius: 10px;
`;
