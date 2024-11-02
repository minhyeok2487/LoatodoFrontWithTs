import { useState } from "react";
import styled from "styled-components";

import { COMMUNITY_CATEGORY } from "@core/constants";
import type { CommunityCategory } from "@core/types/community";

const CommunityForm = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    CommunityCategory | undefined
  >();
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");

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
          {/* <PostButton onClick={handleSubmit} disabled={createPost.isPending}>
            {createPost.isPending ? "게시 중..." : "게시하기"}
          </PostButton> */}
        </PostFormRight>
        <CategoryTabsWrapper>
          {Object.entries(COMMUNITY_CATEGORY).map(([key, label]) => (
            <CategoryTab
              key={key}
              active={selectedCategory === key}
              onClick={() => setSelectedCategory(key as CommunityCategory)}
            >
              {label}
            </CategoryTab>
          ))}
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
  background: ${(props) => (props.isOn ? "#333" : "#E5E5E5")};
  border-radius: 12px;
  position: relative;
  cursor: pointer;

  &:after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: ${(props) => (props.isOn ? "22px" : "2px")};
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
  background: ${(props) => (props.active ? "#333" : "#F5F5F5")};
  color: ${(props) => (props.active ? "white" : "#333")};

  &:hover {
    background: ${(props) => (props.active ? "#333" : "#EAEAEA")};
  }
`;

export default CommunityForm;
