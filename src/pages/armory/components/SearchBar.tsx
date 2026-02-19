import { useState, type FC, type FormEvent } from "react";
import styled from "styled-components";

import Button from "@components/Button";

interface Props {
  defaultValue?: string;
  onSearch: (characterName: string) => void;
  isLoading?: boolean;
}

const SearchBar: FC<Props> = ({ defaultValue = "", onSearch, isLoading }) => {
  const [value, setValue] = useState(defaultValue);

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
        placeholder="캐릭터명을 입력하세요"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button type="submit" variant="contained" disabled={isLoading}>
        {isLoading ? "검색 중..." : "검색"}
      </Button>
    </Form>
  );
};

export default SearchBar;

const Form = styled.form`
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 480px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.dark1};
  font-size: 15px;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light2};
  }

  &:focus {
    border-color: ${({ theme }) => theme.app.text.dark2};
  }
`;
