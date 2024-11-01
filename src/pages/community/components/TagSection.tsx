import styled from "styled-components";

const TagSection = () => {
  return (
    <TagSectionWrapper>
      <SectionTitle>태그</SectionTitle>
      <TagList>
        <TagItem>전체</TagItem>
        <TagItem>일상</TagItem>
        <TagItem>깐부모집</TagItem>
        <TagItem>길드모집</TagItem>
        <TagItem>고정팟모집</TagItem>
        <TagItem>로투두공지</TagItem>
        <TagItem>로투두건의사항</TagItem>
      </TagList>
    </TagSectionWrapper>
  );
};

const TagSectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const TagList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TagItem = styled.div`
  padding: 6px 12px;
  background-color: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  color: ${({ theme }) => theme.app.text.dark1};

  &:hover {
    background-color: ${({ theme }) => theme.app.bg.reverse};
  }
`;

export default TagSection;