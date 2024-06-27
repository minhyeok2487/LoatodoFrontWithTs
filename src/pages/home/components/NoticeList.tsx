import styled from "@emotion/styled";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

import useNotices from "@core/hooks/queries/notice/useNotices";
import useOfficialNotices from "@core/hooks/queries/notice/useOfficialNotices";
import type { NoticeType } from "@core/types/notice";

interface Props {
  type: NoticeType;
}

const NoticeList = ({ type }: Props) => {
  const { getNotices } = useNotices(
    { page: 1, size: 6 },
    { enabled: type === "LOA_TODO" }
  );
  const { getOfficialNotices } = useOfficialNotices(
    { page: 1, size: 6 },
    { enabled: type === "OFFICIAL" }
  );

  const isRecent = (date: string) => {
    const currentDate = dayjs();
    const postDate = dayjs(date);
    const diffHours = currentDate.diff(postDate, "hours");

    return diffHours < 48;
  };

  if (!type) {
    return null;
  }

  return (
    <Wrapper>
      {type === "LOA_TODO"
        ? getNotices.data?.boardResponseDtoList.map((item) => {
            return (
              <Item key={item.id}>
                <Label>공지</Label>

                <Title>
                  <Link to={`/boards/${item.id}`} target="_blank">
                    {item.title}

                    {isRecent(item.regDate) && <NewPostBadge>New</NewPostBadge>}
                  </Link>
                </Title>
              </Item>
            );
          })
        : getOfficialNotices.data?.noticesList.map((item) => {
            return (
              <Item key={item.id}>
                <Label>공지</Label>

                <Title>
                  <Link to={item.link} target="_blank">
                    {item.title}

                    {isRecent(item.date) && <NewPostBadge>New</NewPostBadge>}
                  </Link>
                </Title>
              </Item>
            );
          })}
    </Wrapper>
  );
};

export default NoticeList;

const Wrapper = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 100%;

  ${({ theme }) => theme.medias.max900} {
    gap: 16px;
  }
`;

const Item = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  overflow: hidden;
`;

const Label = styled.span`
  font-size: 13px;
  line-height: 1;
  padding: 7px 13px;
  background: ${({ theme }) => theme.app.label.bg1};
  color: ${({ theme }) => theme.app.label.text1};
  border-radius: 50px;
`;

const Title = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;

  a {
    display: inline-block;
    position: relative;
    padding: 5px 10px;
    max-width: 100%;
    color: ${({ theme }) => theme.app.text.main};
    font-weight: 400;
    font-size: 16px;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const NewPostBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  width: 5px;
  height: 5px;
  background: ${({ theme }) => theme.app.red};
  font-size: 0;
  border-radius: 50%;
`;
