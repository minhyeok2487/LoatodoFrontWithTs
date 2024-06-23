import styled from "@emotion/styled";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DefaultLayout from "@layouts/DefaultLayout";

import * as boardApi from "@core/apis/Board.api";

import BoxTitle from "@components/BoxTitle";
import Button from "@components/Button";
import EditorBox from "@components/EditorBox";

const BoardInsertForm = () => {
  // state 설정
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [fileNames, setFileNames] = useState<string[]>([]);

  const addFileNames = (fileName: string) => {
    setFileNames([...fileNames, fileName]);
  };

  // useNavigate 사용
  const navigate = useNavigate();
  const onInsert = async (title: string, content: string) => {
    try {
      const response = await boardApi.insert(title, content, fileNames);
      alert("등록 완료");
      navigate("/");
    } catch (e) {
      console.log(e);
    }
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

        <Button type="button" onClick={() => onInsert(title, content)}>
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
    background: ${({ theme }) => theme.app.bg.light};
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
