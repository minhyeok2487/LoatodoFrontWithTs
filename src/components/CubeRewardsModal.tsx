import styled from "styled-components";

import useCubeRewards from "@core/hooks/queries/cube/useCubeRewards";

import Modal from "@components/Modal";

interface Props {
  isOpen: boolean;
  onClose(): void;
}

const CubeRewardsModal = ({ isOpen, onClose }: Props) => {
  const getCubeRewards = useCubeRewards({
    enabled: isOpen,
  });

  return (
    <Modal title="에브니 큐브 평균 데이터" isOpen={isOpen} onClose={onClose}>
      <Wrapper>
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
              <Tr key={index}>
                <Td>{item.name}</Td>
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
      </Wrapper>
    </Modal>
  );
};

export default CubeRewardsModal;

const Wrapper = styled.div`
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

const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
`;
