import { FC, useEffect, useState } from "react";

import { getBoards } from "@core/apis/Board.api";
import { getNotices } from "@core/apis/Home.api";
import { BoardType } from "@core/types/BoardResonse";
import { Notices } from "@core/types/NoticeResponse";

interface Props {
  type: string;
}

const NoticesWrap: FC<Props> = ({ type }) => {
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
    const currentDate: Date = new Date();
    const boardDate: Date = new Date(date);
    const timeDifference: number = currentDate.getTime() - boardDate.getTime();
    const daysDifference: number = timeDifference / (1000 * 60 * 60 * 24);
    return daysDifference < 2;
  };

  if (!type || dataList == null) {
    return null;
  }

  return (
    <div className="notice-board-list">
      <ul className="board-ul">
        {dataList.map((data) => (
          <li key={data.id} className="board-item">
            <div className="board-link">
              <div className="board-category" aria-label="카테고리">
                <span className="category-span">공지</span>
              </div>
              <div className="board-title" aria-label="제목">
                {type === "Lostark" && data && "link" in data && (
                  <a
                    href={data.link}
                    target="_blank"
                    rel="noreferrer"
                    className="title-span"
                  >
                    {data.title}
                  </a>
                )}
                {type === "LoaTodo" && data && "id" in data && (
                  <a
                    href={`/boards/${data.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="title-span"
                  >
                    {data.title}
                  </a>
                )}
              </div>
              {type === "Lostark" &&
                data &&
                "date" in data &&
                isRecent(data.date) && <div className="board-new">N</div>}

              {type === "LoaTodo" &&
                data &&
                "regDate" in data &&
                isRecent(data.regDate) && <div className="board-new">N</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoticesWrap;
