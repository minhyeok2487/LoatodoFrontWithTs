import styled from "@emotion/styled";
import { IoNotificationsOutline } from "@react-icons/all-files/io5/IoNotificationsOutline";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useReadNotification from "@core/hooks/mutations/notification/useReadNotification";
import useNotifications from "@core/hooks/queries/notification/useNotifications";
import useOutsideClick from "@core/hooks/useOutsideClick";
import type { Notification } from "@core/types/notification";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import UserIcon from "@assets/images/user-icon.png";

const getTimeAgoString = (fromDate: string) => {
  const now = dayjs();

  const monthsAgo = now.diff(dayjs(fromDate), "months");
  if (monthsAgo >= 1) {
    return `${monthsAgo}개월 전`;
  }

  const weeksAgo = now.diff(dayjs(fromDate), "weeks");
  if (weeksAgo >= 1) {
    return `${weeksAgo}주 전`;
  }

  const daysAgo = now.diff(dayjs(fromDate), "days");
  if (daysAgo >= 1) {
    return `${daysAgo}일 전`;
  }

  const hoursAgo = now.diff(dayjs(fromDate), "hours");
  if (hoursAgo >= 1) {
    return `${hoursAgo}시간 전`;
  }

  const minutesAgo = now.diff(dayjs(fromDate), "minutes");
  if (minutesAgo >= 1) {
    return `${minutesAgo}분 전`;
  }

  return `방금`;
};

const NotificationButton = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const notificationListRef = useOutsideClick<HTMLDivElement>(() => {
    setIsOpen(false);
  });
  const firstRef = useRef(true);

  const [isOpen, setIsOpen] = useState(true);

  const readNotification = useReadNotification({
    onSuccess: (_, targetNotificationId) => {
      queryClient.setQueryData<Notification[]>(
        queryKeyGenerator.getNotifications(),
        (list) => {
          if (list !== undefined) {
            return list.map((item) => {
              return {
                ...item,
                read: item.id === targetNotificationId ? true : item.read,
              };
            });
          }

          return [];
        }
      );
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getNotificationStatus(),
      });
    },
  });
  const { getNotifications, getNotificationStatus } = useNotifications(
    {
      enabled: firstRef.current && isOpen,
    },
    (message, notification) => {
      if (notification.notificationType === "FRIEND") {
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getFriends(),
        });
      }

      toast(message, {
        data: notification,
      });
    }
  );

  useEffect(() => {
    if (getNotifications.data) {
      firstRef.current = false;
    }
  }, [getNotifications.data]);

  return (
    <Wrapper ref={notificationListRef}>
      <Button onClick={() => setIsOpen(!isOpen)}>
        {getNotificationStatus.data
          ? getNotificationStatus.data.unreadCount > 0 && (
              <NotificationBadge>
                {getNotificationStatus.data.unreadCount}
              </NotificationBadge>
            )
          : null}
        <IoNotificationsOutline />
      </Button>

      {isOpen && (
        <Box>
          <Header>
            <Title>알림</Title>
            <CloseButton onClick={() => setIsOpen(false)}>
              <MdClose />
            </CloseButton>
          </Header>

          {getNotifications.data && (
            <NotificationList>
              {getNotifications.data.map((item) => {
                const onClick = async (e?: MouseEvent<HTMLLIElement>) => {
                  e?.stopPropagation();

                  await readNotification.mutateAsync(item.id);

                  switch (item.notificationType) {
                    case "BOARD":
                      navigate(`/boards/${item.data.boardId}`);
                      break;
                    case "COMMENT":
                      navigate({
                        pathname: "/comments",
                        search: `?page=${item.data.page}&commentId=${item.data.commentId}`,
                      });
                      break;
                    case "FRIEND":
                      navigate("/friends");
                      break;
                    default:
                      break;
                  }
                };

                return (
                  <NotificationItem
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={onClick}
                    onKeyDown={(e) => {
                      if (e.target !== e.currentTarget) {
                        return;
                      }
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onClick();
                      }
                    }}
                  >
                    {!item.read && <NewNotificationBadge />}
                    {(() => {
                      switch (item.notificationType) {
                        case "BOARD":
                          return (
                            <>
                              <ImageBox>📢</ImageBox>
                              <DescriptionBox>
                                <p className="description">
                                  <Highlighter
                                    highlightClassName="highlight"
                                    searchWords={["공지사항"]}
                                    textToHighlight={item.content}
                                  />
                                </p>
                                <p className="created-at">
                                  {getTimeAgoString(item.createdDate)}
                                </p>
                              </DescriptionBox>
                            </>
                          );
                        case "COMMENT":
                          return (
                            <>
                              <ImageBox>💬</ImageBox>
                              <DescriptionBox>
                                <p className="description">
                                  <Highlighter
                                    highlightClassName="highlight"
                                    searchWords={["방명록", "댓글"]}
                                    textToHighlight={item.content}
                                  />
                                </p>
                                <p className="created-at">
                                  {getTimeAgoString(item.createdDate)}
                                </p>
                              </DescriptionBox>
                            </>
                          );
                        case "FRIEND":
                          return (
                            <>
                              <ImageBox>
                                <ProfileImage
                                  alt={`${item.data.friendCharacterName}의 프로필 이미지`}
                                  src={UserIcon}
                                />
                              </ImageBox>
                              <DescriptionBox>
                                <p className="description">
                                  <span className="nickname">
                                    {item.data.friendCharacterName}
                                  </span>
                                  <Highlighter
                                    highlightClassName="highlight"
                                    searchWords={["깐부요청", "깐부요청중"]}
                                    textToHighlight={item.content}
                                  />
                                </p>
                                <p className="created-at">
                                  {getTimeAgoString(item.createdDate)}
                                </p>
                              </DescriptionBox>
                            </>
                          );
                        default:
                          return null;
                      }
                    })()}
                  </NotificationItem>
                );
              })}
            </NotificationList>
          )}
        </Box>
      )}
    </Wrapper>
  );
};

export default NotificationButton;

const Wrapper = styled.div`
  position: relative;
`;

const Button = styled.button`
  padding: 5px;
  color: ${({ theme }) => theme.app.white};
  font-size: 24px;
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  padding: 3px;
  min-width: 18px;
  line-height: 1;
  font-size: 12px;
  border-radius: 20px;
  background: ${({ theme }) => theme.app.red};
`;

const Box = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translateY(calc(100% + 30px));
  display: flex;
  flex-direction: column;
  padding: 18px 8px 24px;
  width: 320px;
  height: 495px;
  background: ${({ theme }) => theme.app.bg.light};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;

  ${({ theme }) => theme.medias.max500} {
    position: fixed;
    left: 0;
    top: 60px;
    width: 100%;
    transform: unset;
    border-radius: 0;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 12px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark2};
`;

const CloseButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 14px;
  background: ${({ theme }) => theme.app.bg.gray1};
  color: ${({ theme }) => theme.app.text.light2};
`;

const NotificationList = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 495px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const NotificationItem = styled.li`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  gap: 12px;
  padding: 8px 0 8px 12px;
  overflow: hidden;
  border-radius: 8px;

  &:focus-visible {
    outline: none;
    background: ${({ theme }) => theme.app.bg.main};
  }

  &:hover {
    background: ${({ theme }) => theme.app.bg.main};
  }
`;

const NewNotificationBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.app.red};
`;

const ImageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 36px;
`;

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const DescriptionBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  min-height: 36px;
  line-height: 1;

  p.description {
    font-size: 15px;
    font-weight: 400;
    color: ${({ theme }) => theme.app.text.black};
    word-break: keep-all;

    & * {
      font-weight: inherit;
    }

    .highlight {
      font-weight: 600;
      background: none;
    }

    span.nickname {
      font-weight: 500;
    }

    strong {
      font-weight: 600;
    }
  }

  p.created-at {
    font-size: 13px;
    font-weight: 400;
    color: ${({ theme }) => theme.app.text.light2};
  }
`;

/* const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
`; */
