import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from "@components/Modal";
import type { CubeReward } from "@core/types/character";

interface CubeStatisticsProps {
  cubeStatistics: CubeReward[];
}

const CubeStatistics: React.FC<CubeStatisticsProps> = ({ cubeStatistics }) => {
  const [showModal, setShowModal] = useState(false);

  const renderModalContent = () => (
    <div className="mt-2 px-7 py-3 overflow-x-auto">
      <Table>
        <thead>
          <Tr>
            <Th>이름</Th>
            <Th>1레벨보석</Th>
            <Th>가격(G)</Th>
            <Th>총 가격(G)</Th>
            <Th>돌파석</Th>
            <Th>실링</Th>
            <Th>은총</Th>
            <Th>축복</Th>
            <Th>가호</Th>
            <Th>카경</Th>
          </Tr>
        </thead>
        <tbody>
          {cubeStatistics.map((cube, index) => (
            <Tr key={index}>
              <Td>{cube.name}</Td>
              <Td>{cube.jewelry}</Td>
              <Td>{cube.jewelryPrice}</Td>
              <Td>{cube.jewelry * cube.jewelryPrice}</Td>
              <Td>{cube.leapStone}</Td>
              <Td>{cube.shilling}</Td>
              <Td>{cube.solarGrace}</Td>
              <Td>{cube.solarBlessing}</Td>
              <Td>{cube.solarProtection}</Td>
              <Td>{cube.cardExp}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <StyledButton onClick={() => setShowModal(true)}>
        통계 보기
      </StyledButton>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="큐브 통계"
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
}

const StyledButton = styled.button`
  background-color: #4a90e2;
  color: white;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357abd;
  }
`;

const Table = styled.table`
  font-size: 14px;
`;

const Th = styled.th`
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  text-align: left;
  padding: 12px;
  border-bottom: 2px solid #dee2e6;
  text-align: center;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  text-align: center;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f1f3f5;
  }
`;

export default CubeStatistics;