import styled from "@emotion/styled";
import { IoNotificationsOutline } from "@react-icons/all-files/io5/IoNotificationsOutline";
import { useEffect, useReducer, useRef } from "react";
import { toast } from "react-toastify";

import useNotifications from "@core/hooks/queries/notification/useNotifications";
import useOutsideClick from "@core/hooks/useOutsideClick";

import BoxTitle from "@components/BoxTitle";

const Notification = () => {
  const notificationListRef = useOutsideClick<HTMLUListElement>(() => {
    toggleIsOpen();
  });
  const firstRef = useRef(true);
  const [isOpen, toggleIsOpen] = useReducer((state) => !state, false);

  const { getNotifications, hasNewNotification, latestNotification } =
    useNotifications({
      enabled: firstRef.current || isOpen,
    });

  useEffect(() => {
    if (hasNewNotification && latestNotification) {
      toast(latestNotification.content);
    }
  }, [hasNewNotification, latestNotification]);

  useEffect(() => {
    if (getNotifications.data) {
      firstRef.current = false;
    }
  }, [getNotifications.data]);

  return (
    <Wrapper>
      <Button onClick={() => toggleIsOpen()}>
        {hasNewNotification && <NotificationBadge />}
        <IoNotificationsOutline />
      </Button>

      {isOpen && getNotifications.data && (
        <NotificationList ref={notificationListRef}>
          <BoxTitle>알림</BoxTitle>
          {getNotifications.data.map((item) => (
            <NotificationItem key={item.id}>
              <DescriptionBox>
                <p>{item.content}</p>
                <em>{item.createdDate}</em>
              </DescriptionBox>
            </NotificationItem>
          ))}
        </NotificationList>
      )}
    </Wrapper>
  );
};

export default Notification;

const Wrapper = styled.div`
  position: relative;
`;

const Button = styled.button`
  position: relative;
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

const NotificationList = styled.ul`
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translateY(calc(100% + 30px));
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px 20px 24px;
  min-width: 320px;
  background: ${({ theme }) => theme.app.bg.light};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
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
  align-items: center;
  height: 42px;
`;

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
`;

const DescriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  min-height: 42px;
  gap: 4px;
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

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
`;
