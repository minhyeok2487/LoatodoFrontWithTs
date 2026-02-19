import { useState, useEffect, type FC, type FormEvent } from "react";
import styled from "styled-components";

interface Props {
  defaultValue?: string;
  onSearch: (characterName: string) => void;
  isLoading?: boolean;
}

const SearchBar: FC<Props> = ({ defaultValue = "", onSearch, isLoading }) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="캐릭터명을 입력 후 Enter"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <SubmitButton type="submit" disabled={isLoading}>
        {isLoading ? "갱신 중..." : "갱신하기"}
      </SubmitButton>
    </Form>
  );
};

export default SearchBar;

const Form = styled.form`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const Input = styled.input`
  width: 220px;
  padding: 7px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.dark1};
  font-size: 13px;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light2};
  }

  &:focus {
    border-color: ${({ theme }) => theme.app.text.dark2};
  }

  ${({ theme }) => theme.medias.max768} {
    width: 160px;
  }
`;

const SubmitButton = styled.button`
  padding: 7px 14px;
  border-radius: 6px;
  background: #f59e0b;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  border: none;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #d97706;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
