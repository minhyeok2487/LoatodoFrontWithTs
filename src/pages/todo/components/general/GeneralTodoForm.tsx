import styled from "styled-components";

import type { FormEvent } from "react";
import { SectionTitle } from "./styles";

interface Props {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const GeneralTodoForm = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
}: Props) => {
  return (
    <FormContainer>
      <SectionTitle>할 일 추가</SectionTitle>
      <Form onSubmit={onSubmit}>
        <Input
          placeholder="할 일 제목"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
        />
        <TextArea
          rows={3}
          placeholder="메모 (선택)"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
        />
        <SubmitButton type="submit">추가하기</SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default GeneralTodoForm;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  resize: vertical;
`;

const SubmitButton = styled.button`
  align-self: flex-end;
  padding: 10px 18px;
  border-radius: 6px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border: 1px solid ${({ theme }) => theme.app.border};
  color: ${({ theme }) => theme.app.text.main};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray2};
  }
`;
