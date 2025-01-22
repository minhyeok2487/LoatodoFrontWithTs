import { useState } from "react";
import styled from "styled-components";

import type { EditCommunityPostRequest } from "@core/types/community";

const EditForm = ({
  body,
  communityId,
  onSubmit,
}: {
  body: string;
  communityId: number;
  onSubmit: (editedData: EditCommunityPostRequest) => void;
}) => {
  const [editedText, setEditedText] = useState(body);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ body: editedText, communityId });
  };

  return (
    <Wrapper onSubmit={handleSubmit}>
      <TextArea
        value={editedText}
        onChange={(e) => {
          setEditedText(e.target.value);
        }}
        placeholder="아크라시아에서 무슨 일이 있었나요?"
      />
      <Button type="submit">수정하기</Button>
    </Wrapper>
  );
};

export default EditForm;

const Wrapper = styled.form`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  align-items: center; /* 가로 방향 중앙 정렬 */
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px; /* 높이를 조정할 수 있습니다 */
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 4px;
  padding: 10px;

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light1};
  }
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.app.bg.main};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.app.bg.gray1};
  }
`;
