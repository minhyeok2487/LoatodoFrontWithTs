import styled from "styled-components";

interface Props {
  author: string;
  time: string;
  category?: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
}

const CommunityItem = ({ author, time, category, content, images, likes, comments }: Props) => {
  return (
    <PostItemWrapper>
      <PostHeader>
        <PostAuthor>{author}</PostAuthor>
        <PostMeta>
          <PostTime>{time}</PostTime>
          {category && <PostCategory>{category}</PostCategory>}
        </PostMeta>
        <MoreButton>...</MoreButton>
      </PostHeader>

      <PostContent>{content}</PostContent>

      {images && images.length > 0 && (
        <PostImages>
          {images.map((image, index) => (
            <PostImage key={index} src={image} alt="" />
          ))}
        </PostImages>
      )}

      <PostFooter>
        <PostStat>
          <LikeIcon>👍</LikeIcon> {likes}
        </PostStat>
        <PostStat>
          <CommentIcon>💬</CommentIcon> {comments}
        </PostStat>
      </PostFooter>
    </PostItemWrapper>
  );
};

const PostItemWrapper = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};

  &:last-child {
    border-bottom: none;
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const PostAuthor = styled.div`
  font-weight: bold;
  font-size: 14px;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PostTime = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const PostCategory = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const MoreButton = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.app.text.light2};
`;

const PostContent = styled.div`
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
  white-space: pre-line;
`;

const PostImages = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
`;

const PostImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
`;

const PostFooter = styled.div`
  display: flex;
  gap: 16px;
`;

const PostStat = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const LikeIcon = styled.span``;
const CommentIcon = styled.span``;

export default CommunityItem;