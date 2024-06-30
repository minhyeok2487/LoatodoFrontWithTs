import styled from "@emotion/styled";
import { IoNotificationsOutline } from "@react-icons/all-files/io5/IoNotificationsOutline";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import useNotifications from "@core/hooks/queries/notification/useNotifications";

const Notification = () => {
  const firstRef = useRef(true);
  const [isOpen, setIsOpen] = useState(false);

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
      {hasNewNotification && <NotificationBadge />}
      <IoNotificationsOutline />
    </Wrapper>
  );
};

export default Notification;

const Wrapper = styled.button`
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
