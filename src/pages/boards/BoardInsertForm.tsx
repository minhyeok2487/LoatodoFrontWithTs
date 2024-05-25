import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as boardApi from "../../core/apis/Board.api";
import EditorBax from "../../components/EditorBax";

const BoardInsertForm = () => {
    // state 설정
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [fileNames, setFileNames] = useState<string[]>([]);

    const addFileNames = (fileName:string) => {
        setFileNames([...fileNames, fileName]);
    }

    // useNavigate 사용
    const navigate = useNavigate();
    const onInsert = async (title:string, content:string) => {
        try {
            const response = await boardApi.insert(title, content, fileNames);
            alert("등록 완료");
            navigate('/');
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="wrap">
            <div className="boards-insert-wrap">
                <h1>공지사항 등록</h1>
                <div className="boards-insert-title">
                    <p>제목</p>
                    <input type='text' value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="boards-insert-content">
                    <p>내용</p>
                    <EditorBax setContent={setContent} addFileNames={addFileNames} />
                </div>
                <div>
                    <button onClick={() => onInsert(title, content)}>등록</button>
                </div>
            </div>
        </div>
    );
};

export default BoardInsertForm;