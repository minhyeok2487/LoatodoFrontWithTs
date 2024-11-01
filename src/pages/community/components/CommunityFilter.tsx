import { useState } from "react";
import styled from "styled-components";

const PostFilter = () => {

    const [menuOpen, setMenuOpen] = useState(false);
  return (
    <FilterWrapper>
      <FilterLeft>
        <FilterItem active>전체</FilterItem>
        <Divider>|</Divider>
        <FilterItem>팔로우</FilterItem>
        <Divider>|</Divider>
        <FilterItem>내가 쓴 글</FilterItem>
      </FilterLeft>
      <MenuContainer>
        <IconWrapper onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            />
          </svg>
        </IconWrapper>
        {menuOpen && (
          <MenuDropdown>
            <MenuItem>차단하기</MenuItem>
            <MenuItem>신고하기</MenuItem>
          </MenuDropdown>
        )}
      </MenuContainer>
    </FilterWrapper>
  );
};

const FilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
`;

const FilterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FilterItem = styled.div<{ active?: boolean }>`
  font-size: 14px;
  color: ${({ active, theme }) => active ? theme.app.text.dark1 : theme.app.text.light2};
  cursor: pointer;
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
`;

const Divider = styled.span`
  color: ${({ theme }) => theme.app.text.light2};
`;

const MenuContainer = styled.div`
  position: relative;
`;

const IconWrapper = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.app.text.light2};
  
  &:hover {
    color: ${({ theme }) => theme.app.text.dark1};
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 120px;
`;

const MenuItem = styled.div`
  padding: 8px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.dark1};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
  }
`;

export default PostFilter;