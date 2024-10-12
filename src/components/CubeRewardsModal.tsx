import { useMemo } from "react";
import styled from "styled-components";

import { CUBE_TUPLE } from "@core/constants";
import useCubeRewards from "@core/hooks/queries/cube/useCubeRewards";
import type { Character } from "@core/types/character";

import CubeIcon from "@components/CubeIcon";
import Modal from "@components/Modal";

interface Props {
  onClose(): void;
  isOpen?: boolean;
  targetCharacter?: Character;
}

const CubeRewardsModal = ({ onClose, isOpen, targetCharacter }: Props) => {
  const getCubeRewards = useCubeRewards({
    enabled: isOpen,
  });

  const currentCubeName = useMemo(() => {
    if (targetCharacter) {
      const tuple = CUBE_TUPLE.find(([, maximumLevel]) => {
        return targetCharacter.itemLevel < maximumLevel;
      });

      return tuple?.[0] ?? "";
    }

    return "";
  }, [targetCharacter]);

  return (
    <Modal
      title="에브니 큐브 평균 데이터"
      isOpen={isOpen || !!targetCharacter}
      onClose={onClose}
    >
      <Wrapper>
        <Caution>* 보석 시세는 매일 0시에 갱신됩니다.</Caution>
        <TableWrapper>
          <Table>
            <thead>
              <Tr>
                <Th>이름</Th>
                <Th>1레벨 보석</Th>
                <Th>골드(G)</Th>
                <Th>총 골드(G)</Th>
                <Th>돌파석</Th>
                <Th>실링</Th>
                <Th>은총</Th>
                <Th>축복</Th>
                <Th>가호</Th>
                <Th>카경</Th>
              </Tr>
            </thead>
            <tbody>
              {getCubeRewards.data?.map((item, index) => (
                <Tr key={index} $highlight={currentCubeName === item.name}>
                  <Td>
                    <TicketName>
                      <CubeIcon cubeTicketKey={item.name} /> {item.name}
                    </TicketName>
                  </Td>
                  <Td>{item.jewelry.toLocaleString()}</Td>
                  <Td>{item.jewelryPrice.toLocaleString()}</Td>
                  <Td>{(item.jewelry * item.jewelryPrice).toLocaleString()}</Td>
                  <Td>{item.leapStone.toLocaleString()}</Td>
                  <Td>{item.shilling.toLocaleString()}</Td>
                  <Td>{item.solarGrace.toLocaleString()}</Td>
                  <Td>{item.solarBlessing.toLocaleString()}</Td>
                  <Td>{item.solarProtection.toLocaleString()}</Td>
                  <Td>{item.cardExp.toLocaleString()}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </Wrapper>
    </Modal>
  );
};

export default CubeRewardsModal;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Caution = styled.p`
  margin-bottom: 10px;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  font-size: 14px;
  width: 700px;
  table-layout: fixed;

  th,
  td {
    width: 100px;
  }

  tr {
    th:first-of-type,
    td:first-of-type {
      position: fixed;
    }

    th:nth-of-type(2),
    td:nth-of-type(2) {
      padding-left: 100px;
      width: 200px;
    }
  }
`;

const TicketName = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 100%;
`;

const Tr = styled.tr<{ $highlight?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.app.border};

  td {
    background: ${({ $highlight, theme }) =>
      $highlight && theme.app.bg.reverse};
    color: ${({ $highlight, theme }) => $highlight && theme.app.text.reverse};
  }
`;

const Th = styled.th`
  padding: 12px;
  background: ${({ theme }) => theme.app.bg.gray1};
  color: ${({ theme }) => theme.app.text.dark2};
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
`;

const Td = styled.td`
  padding: 12px 0;
  text-align: center;
  background: ${({ theme }) => theme.app.bg.white};
`;
