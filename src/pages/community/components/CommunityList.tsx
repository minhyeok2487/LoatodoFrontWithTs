import styled from "styled-components";
import CommunityItem from "./CommunityItem";
import CommunityFilter from "./CommunityFilter";

const CommunityList = () => {
  return (
    <PostListWrapper>
      <CommunityFilter />
      <PostItems>
        <CommunityItem 
          author="익명의 바드9248"
          time="7분전"
          category="일상"
          content="오늘 하키르에서 미친 것 같더라 공짜에서 누가 원한각인서 먹었는데 찐으로 뽑지로 1만골씩 보내줄ㅋㅋㅋㅋㅋ 내게도 이런일이 생기네 사장님이신가"
          likes={77}
          comments={0}
        />
        <CommunityItem 
          author="안비"
          time="7분전"
          category="깐부모집"
          content="일요일 오후 10시에 하키르 가실분 계실까요? 깐부구해요 댓글이나 인게임 안비로 찜방주세요"
          likes={77}
          comments={0}
        />
        {/* 더 많은 PostItem들... */}
      </PostItems>
    </PostListWrapper>
  );
};

const PostListWrapper = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
`;

const PostItems = styled.div`
  display: flex;
  flex-direction: column;
`;

export default CommunityList;