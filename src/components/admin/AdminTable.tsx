import type { ReactNode } from "react";
import styled from "styled-components";

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (item: T, index: number) => ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  isLoading?: boolean;
}

const AdminTable = <T,>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "데이터가 없습니다.",
  isLoading = false,
}: Props<T>) => {
  if (isLoading) {
    return (
      <TableWrapper>
        <StatusMessage>로딩 중...</StatusMessage>
      </TableWrapper>
    );
  }

  if (data.length === 0) {
    return (
      <TableWrapper>
        <StatusMessage>{emptyMessage}</StatusMessage>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            {columns.map((column) => (
              <Th key={column.key} $width={column.width}>
                {column.header}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <Tr key={keyExtractor(item)}>
              {columns.map((column) => (
                <Td key={column.key}>
                  {column.render
                    ? column.render(item, index)
                    : (item as Record<string, unknown>)[column.key] as ReactNode}
                </Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
};

export default AdminTable;

const TableWrapper = styled.div`
  overflow-x: auto;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 12px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th<{ $width?: string }>`
  text-align: left;
  padding: 14px 16px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light1};
  background: ${({ theme }) => theme.app.bg.gray1};
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
  white-space: nowrap;
  width: ${({ $width }) => $width || "auto"};

  &:first-child {
    border-top-left-radius: 12px;
  }

  &:last-child {
    border-top-right-radius: 12px;
  }
`;

const Tr = styled.tr`
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
  }
`;

const Td = styled.td`
  padding: 14px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.main};
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
  vertical-align: middle;

  tr:last-child & {
    border-bottom: none;
  }
`;

const StatusMessage = styled.div`
  padding: 48px;
  text-align: center;
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 14px;
`;
