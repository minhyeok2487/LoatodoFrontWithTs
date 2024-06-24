import styled from "@emotion/styled";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import type { FC } from "react";
import { Link } from "react-router-dom";

import { getBoards } from "@core/apis/board.api";
import { getNotices } from "@core/apis/home.api";
import { BoardType } from "@core/types/board";
import { Notices } from "@core/types/notice";
import type { NoticeType } from "@core/types/notice";

interface Props {
  type: NoticeType;
}

const NoticeList: FC<Props> = ({ type }) => {
  const [dataList, setDataList] = useState<Notices[] | BoardType[] | null>(
    null
  );

  const fetchData = async (type: string) => {
    if (type === "Lostark") {
      try {
        const data = await getNotices(1, 6);
        setDataList(data.noticesList);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    }
    if (type === "LoaTodo") {
      try {
        const data = await getBoards(1, 6);
        setDataList(data.boardResponseDtoList);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    }
  };

  useEffect(() => {
    fetchData(type);
  }, [type]);

  const isRecent = (date: string) => {
    const currentDate = dayjs();
    const postDate = dayjs(date);
    const diffHours = currentDate.diff(postDate, "hours");

    return diffHours < 48;
  };

  if (!type || dataList == null) {
    return null;
  }

  return (
    <Wrapper>
      {dataList.map((data) => (
        <Item key={data.id}>
          <Label>공지</Label>

          <Title>
            {type === "Lostark" && data && "link" in data && (
              <Link to={data.link} target="_blank">
                {data.title}

                {"date" in data && isRecent(data.date) && (
                  <NewPostBadge>New</NewPostBadge>
                )}
              </Link>
            )}
            {type === "LoaTodo" && data && "id" in data && (
              <Link to={`/boards/${data.id}`} target="_blank">
                {data.title}

                {"regDate" in data && isRecent(data.regDate) && (
                  <NewPostBadge>New</NewPostBadge>
                )}
              </Link>
            )}
          </Title>
        </Item>
      ))}
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
