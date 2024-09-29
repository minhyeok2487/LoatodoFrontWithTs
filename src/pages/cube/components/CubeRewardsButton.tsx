import { useState } from "react";
import styled from "styled-components";

import useCubeRewards from "@core/hooks/queries/cube/useCubeRewards";

import Button from "@components/Button";
import Modal from "@components/Modal";

const CubeRewardsButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const getCubeRewards = useCubeRewards();

  return (
    <>
      <Button variant="contained" size="large" onClick={() => setIsOpen(true)}>
        API 통계보기
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="큐브 API 평균 통계"
      >
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
                <Td>{item.jewelry}</Td>
                <Td>{item.jewelryPrice}</Td>
                <Td>{item.jewelry * item.jewelryPrice}</Td>
                <Td>{item.leapStone}</Td>
                <Td>{item.shilling}</Td>
                <Td>{item.solarGrace}</Td>
                <Td>{item.solarBlessing}</Td>
                <Td>{item.solarProtection}</Td>
                <Td>{item.cardExp}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Modal>
    </>
  );
};

export default CubeRewardsButton;

const Table = styled.table`
  font-size: 14px;
`;

const Th = styled.th`
  padding: 12px;
  background: ${({ theme }) => theme.app.bg.gray1};
  color: ${({ theme }) => theme.app.text.dark2};
  font-weight: 600;
  text-align: center;
  border-bottom: 2px solid ${({ theme }) => theme.app.border};
`;

const Td = styled.td`
  padding: 12px;
  text-align: center;
`;

const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
`;
