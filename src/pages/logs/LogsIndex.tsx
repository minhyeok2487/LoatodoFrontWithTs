import { FaGem } from "@react-icons/all-files/fa/FaGem";
import { FaStar } from "@react-icons/all-files/fa/FaStar";
import { FaSwift } from "@react-icons/all-files/fa/FaSwift";
import { useEffect, useState } from "react";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import mainAxios from "@core/apis/mainAxios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  padding-left: 20px;
  border-left: 2px solid ${({ theme }) => theme.app.border};
`;

const Card = styled.div`
  display: flex;
  align-items: flex-start;
  border: 1px solid ${({ theme }) => theme.app.bg.gray2};
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
  width: 100%;
  position: relative;
  flex-direction: row;
`;

const LogMessage = styled.p`
  white-space: normal;
  word-break: break-word; // 텍스트가 길어지면 줄바꿈이 되도록 설정
  margin: 0;
  flex-grow: 1; // 남은 공간을 차지하도록 설정
  width: 100%; // 부모 크기 맞추기
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 16px;
  font-size: 24px;
  color: white;
`;

const getIcon = (name: string) => {
  switch (name) {
    case "CHAOS":
      return (
        <IconWrapper style={{ backgroundColor: "orange" }}>
          <FaStar />
        </IconWrapper>
      );
    case "GUARDIAN":
      return (
        <IconWrapper style={{ backgroundColor: "purple" }}>
          <FaSwift />
        </IconWrapper>
      );
    case "RAID":
      return (
        <IconWrapper style={{ backgroundColor: "blue" }}>
          <FaGem />
        </IconWrapper>
      );
    default:
      return <IconWrapper style={{ backgroundColor: "gray" }}>?</IconWrapper>;
  }
};

const DateSeparator = styled.div`
  width: 100%;
  font-weight: bold;
  margin: 16px 0;
  padding-bottom: 8px;
  display: flex;
  align-items: center;
  color: #007bff;
  font-size: 1.2em;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    left: -12px;
    width: 8px;
    height: 8px;
    background-color: #007bff;
    border-radius: 50%;
  }
`;

const LogsIndex = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await mainAxios.get("/api/v1/logs");
        setLogs(response.data);
      } catch (err) {
        setError("Failed to fetch logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  let lastDate = "";

  return (
    <DefaultLayout pageTitle="Logs">
      <p>테스트 중입니다. 혹시 잘못된 로그를 발견하신다면 언제든 알려주세요.</p>
      <p>빠르면 2월 19일... 늦어도 2월 26일까지는 완성시키고자 합니다.</p>
      <p>테스트 기간동안은 로그의 내용이 달라질 수 있습니다.</p>
      <Container>
        {logs.map((log) => {
          const dayOfWeek = new Date(log.localDate).getDay();
          const koreanWeekdays = ["일", "월", "화", "수", "목", "금", "토"];
          const weekday = koreanWeekdays[dayOfWeek];

          const showDateSeparator = log.localDate !== lastDate;
          lastDate = log.localDate;
          return (
            <div key={log.id}>
              {showDateSeparator && (
                <DateSeparator>
                  {log.localDate}({weekday})
                </DateSeparator>
              )}
              <Card>
                {getIcon(log.logContent)}
                <div>
                  <LogMessage>{log.message}</LogMessage>
                  <p>
                    {new Date(log.createdDate)
                      .toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/\s|\.$/g, "")}
                    (
                    {new Date(log.createdDate).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                    )
                  </p>
                </div>
              </Card>
            </div>
          );
        })}
      </Container>
    </DefaultLayout>
  );
};

export default LogsIndex;
