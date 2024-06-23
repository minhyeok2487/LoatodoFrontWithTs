import styled from "@emotion/styled";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";

interface EmailTimerProps {
  onExpired: () => void;
  expiredAt: string;
  isSuccess: boolean;
}

const EmailTimer: React.FC<EmailTimerProps> = ({
  onExpired,
  expiredAt,
  isSuccess,
}) => {
  const countdown = useRef<NodeJS.Timeout>();
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    if (expiredAt) {
      const diffSeconds = dayjs(expiredAt).diff(
        dayjs().format("YYYY-MM-DD HH:mm:ss"),
        "seconds"
      );

      setMinutes(Math.floor(diffSeconds / 60));
      setSeconds(diffSeconds % 60);
    }
  }, [expiredAt]);

  useEffect(() => {
    if (isSuccess) {
      clearInterval(countdown.current);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      onExpired();
      clearInterval(countdown.current);
    }

    if (minutes > 0 || seconds > 0) {
      countdown.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        } else if (minutes > 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        }
      }, 1000);
    }

    return () => clearInterval(countdown.current);
  }, [seconds, minutes]);

  return (
    <>
      {expiredAt && (
        <Wrapper>
          인증번호가 전송되었습니다. {minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </Wrapper>
      )}
    </>
  );
};

export default EmailTimer;

const Wrapper = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.success.main};
`;
