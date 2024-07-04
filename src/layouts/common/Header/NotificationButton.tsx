import styled from "@emotion/styled";
import { IoNotificationsOutline } from "@react-icons/all-files/io5/IoNotificationsOutline";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import useNotifications from "@core/hooks/queries/notification/useNotifications";
import useOutsideClick from "@core/hooks/useOutsideClick";

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

  const secondsAgo = now.diff(dayjs(fromDate), "seconds");
  if (secondsAgo >= 1) {
    return `${secondsAgo}초 전`;
  }

  return "방금";
};

const Notification = () => {
  const notificationListRef = useOutsideClick<HTMLDivElement>(() => {
    // setIsOpen(false);
  });
  const firstRef = useRef(true);

  const [isOpen, setIsOpen] = useState(true);

  const { getNotifications, hasNewNotification } = useNotifications(
    {
      enabled: firstRef.current || isOpen,
    },
    (notification) => {
      toast(notification.content);
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
        {hasNewNotification && <NotificationBadge />}
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
              {getNotifications.data.map((item) => (
                <NotificationItem key={item.id}>
                  {/* <ImageBox>📢</ImageBox>
                  <DescriptionBox>
                    <p>{item.content}</p>
                    <em>{getTimeAgoString(item.createdDate)}</em>
                  </DescriptionBox> */}
                  {/* <ImageBox>💬</ImageBox>
                  <DescriptionBox>
                    <p>{item.content}</p>
                    <em>{getTimeAgoString(item.createdDate)}</em>
                  </DescriptionBox> */}
                  <ImageBox>
                    <ProfileImage alt="상대의 프로필 이미지" src={UserIcon} />
                  </ImageBox>
                  <DescriptionBox>
                    <p>{item.content}</p>
                    <em>{getTimeAgoString(item.createdDate)}</em>
                  </DescriptionBox>
                </NotificationItem>
              ))}
            </NotificationList>
          )}
        </Box>
      )}
    </Wrapper>
  );
};

export default Notification;

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
  top: 2px;
  right: 2px;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  background: ${({ theme }) => theme.app.red};
`;

const Box = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translateY(calc(100% + 30px));
  display: flex;
  flex-direction: column;
  padding: 18px 20px 24px;
  width: max-content;
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
  padding-right: 16px;
  gap: 16px;
  overflow-y: auto;
`;

const NotificationItem = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 12px;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  min-height: 36px;
  line-height: 1;

  p {
    font-size: 15px;
    font-weight: 400;
    color: ${({ theme }) => theme.app.text.black};

    strong {
      font-weight: 600;
    }
  }

  em {
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
