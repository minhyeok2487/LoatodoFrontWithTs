import localeData from "dayjs/plugin/localeData";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import mainAxios from "@core/apis/mainAxios";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    text-align: left;
    border: 1px solid;
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

  return (
    <DefaultLayout pageTitle="Logs">
      <p>테스트 중입니다. 혹시 잘못된 로그를 발견하신다면 언제든 알려주세요.</p>
      <Table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>숙제 종류</th>
            <th>로그</th>
            <th>수익</th>
            <th>체크한 시각</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.localDate}</td>
              <td>{log.name}</td>
              <td>{log.message}</td>
              <td>{log.profit.toLocaleString()}</td>
              <td>{new Date(log.createdDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DefaultLayout>
  );
};

export default LogsIndex;
