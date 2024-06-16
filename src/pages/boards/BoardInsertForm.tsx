import styled from "@emotion/styled";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import * as boardApi from "@core/apis/Board.api";

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
      <div>
        <h1>공지사항 등록</h1>
        <div>
          <p>제목</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <p>내용</p>
          <EditorBox setContent={setContent} addFileNames={addFileNames} />
        </div>
        <div>
          <Button type="button" onClick={() => onInsert(title, content)}>
            등록
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default BoardInsertForm;

const Wrapper = styled.div`
  padding-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
