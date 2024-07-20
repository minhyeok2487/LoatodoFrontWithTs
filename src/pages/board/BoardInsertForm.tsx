import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

import useAddNotice from "@core/hooks/mutations/notice/useAddNotice";

import BoxTitle from "@components/BoxTitle";
import Button from "@components/Button";
import EditorBox from "@components/EditorBox";

const BoardInsertForm = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [fileNames, setFileNames] = useState<string[]>([]);

  const addNotice = useAddNotice({
    onSuccess: () => {
      toast.success("등록 완료");
      navigate("/");
    },
  });

  const addFileNames = (fileName: string) => {
    setFileNames([...fileNames, fileName]);
  };

  return (
    <Wrapper>
      <BoxTitle>공지사항 등록</BoxTitle>
      <TitleRow>
        <BoxTitle>제목</BoxTitle>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </TitleRow>
      <DescriptionBox>
        <BoxTitle>내용</BoxTitle>
        <EditorBox setContent={setContent} addFileNames={addFileNames} />

        <Button
          type="button"
          onClick={() => addNotice.mutate({ title, content, fileNames })}
        >
          등록
        </Button>
      </DescriptionBox>
    </Wrapper>
  );
};

export default BoardInsertForm;

const Wrapper = styled.div`
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  background: ${({ theme }) => theme.app.bg.main};
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  width: 100%;
  color: ${({ theme }) => theme.app.text.black};

  input {
    flex: 1;
    background: ${({ theme }) => theme.app.bg.white};
    border: 1px solid ${({ theme }) => theme.app.border};
  }
`;

const DescriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 40px;
  width: 100%;

  & > button {
    width: 100%;
  }
`;
