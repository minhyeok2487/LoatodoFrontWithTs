import { useState } from "react";
import styled from "styled-components";

const CommunityForm = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");

  const handleSubmit = () => {
    // 게시글 작성 로직
    const postData = {
      content,
      category: selectedCategory,
      isPublic,
    };
    console.log("Submit post:", postData);
  };

  return (
    <CreatePostWrapper>
      <PostFormWrapper>
        <PostInput 
          placeholder="아크라시아에서 무슨 일이 있었나요?" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <PostFormRight>
          <NicknameToggle>
            닉네임 공개
            <ToggleSwitch 
              isOn={isPublic} 
              onClick={() => setIsPublic(!isPublic)} 
            />
          </NicknameToggle>
          <PostButton onClick={handleSubmit}>게시하기</PostButton>
        </PostFormRight>
        <CategoryTabsWrapper>
        <CategoryTab 
          active={selectedCategory === "카테고리"} 
          onClick={() => setSelectedCategory("카테고리")}
        >
          카테고리
        </CategoryTab>
        <CategoryTab 
          active={selectedCategory === "일상"} 
          onClick={() => setSelectedCategory("일상")}
        >
          일상
        </CategoryTab>
        <CategoryTab 
          active={selectedCategory === "깐부모집"} 
          onClick={() => setSelectedCategory("깐부모집")}
        >
          깐부모집
        </CategoryTab>
        <CategoryTab 
          active={selectedCategory === "길드모집"} 
          onClick={() => setSelectedCategory("길드모집")}
        >
          길드모집
        </CategoryTab>
        <CategoryTab 
          active={selectedCategory === "고정팟모집"} 
          onClick={() => setSelectedCategory("고정팟모집")}
        >
          고정팟모집
        </CategoryTab>
        <CategoryTab 
          active={selectedCategory === "개발자에게질문"} 
          onClick={() => setSelectedCategory("개발자에게질문")}
        >
          개발자에게질문
        </CategoryTab>
        <CategoryTab 
          active={selectedCategory === "로투두건의사항"} 
          onClick={() => setSelectedCategory("로투두건의사항")}
        >
          로투두건의사항
        </CategoryTab>
      </CategoryTabsWrapper>
      </PostFormWrapper>

      
    </CreatePostWrapper>
  );
};

const CreatePostWrapper = styled.div`
  margin-bottom: 20px;
`;

const PostFormWrapper = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
`;

const PostInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: none;
  resize: none;
  font-size: 14px;
  margin-bottom: 16px;
  
  &::placeholder {
    color: ${({ theme }) => theme.app.text.light2};
  }
  
  &:focus {
    outline: none;
  }
`;

const PostFormRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
`;

const NicknameToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const ToggleSwitch = styled.div<{ isOn: boolean }>`
  width: 44px;
  height: 24px;
  background: ${props => props.isOn ? '#333' : '#E5E5E5'};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  
  &:after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: ${props => props.isOn ? '22px' : '2px'};
    transition: all 0.2s;
  }
`;

const PostButton = styled.button`
  padding: 8px 16px;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
`;

const CategoryTabsWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const CategoryTab = styled.div<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background: ${props => props.active ? '#333' : '#F5F5F5'};
  color: ${props => props.active ? 'white' : '#333'};
  
  &:hover {
    background: ${props => props.active ? '#333' : '#EAEAEA'};
  }
`;

export default CommunityForm;