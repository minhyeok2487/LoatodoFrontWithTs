import { useMemo } from "react";
import styled from "styled-components";

import { CUBE_TUPLE } from "@core/constants";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useCubeCharacters from "@core/hooks/queries/cube/useCubeCharacters";
import useCubeRewards from "@core/hooks/queries/cube/useCubeRewards";
import type { Character } from "@core/types/character";
import type { CurrentCubeTickets } from "@core/types/cube";
import { getCubeTicketKeyByName, getCubeTicketKeys } from "@core/utils";

import CubeIcon from "@components/CubeIcon";
import Modal from "@components/Modal";

interface Props {
  onClose(): void;
  isOpen?: boolean;
  targetCharacter?: Character;
}

const CubeDashboardModal = ({ onClose, isOpen, targetCharacter }: Props) => {
  const getCharacters = useCharacters();
  const getCubeRewards = useCubeRewards({
    enabled: isOpen,
  });
  const getCubeCharacters = useCubeCharacters();
  const totalTickets = useMemo(() => {
    return (getCubeCharacters.data || []).reduce((acc, cubeCharacter) => {
      const cubeTicketKeys = getCubeTicketKeys(cubeCharacter);
      const newAcc = { ...acc };

      cubeTicketKeys.forEach((key) => {
        newAcc[key] = (acc[key] ?? 0) + (cubeCharacter[key] ?? 0);
      });

      return newAcc;
    }, {} as CurrentCubeTickets);
  }, [getCubeCharacters]);

  const currentCubeName = useMemo(() => {
    if (targetCharacter) {
      const tuple = CUBE_TUPLE.find(([, maximumLevel]) => {
        return targetCharacter.itemLevel < maximumLevel;
      });

      return tuple?.[0] ?? "";
    }

    return "";
  }, [targetCharacter]);
  const cubeCharacter = useMemo(() => {
    if (targetCharacter) {
      return (getCubeCharacters.data ?? []).find(
        (cubeCharacter) =>
          cubeCharacter.characterId === targetCharacter.characterId
      );
    }

    return null;
  }, [getCubeCharacters.data, targetCharacter]);

  const character = (getCharacters.data ?? []).find(
    (character) => character.characterId === targetCharacter?.characterId
  );

  const useCubeCharacter =
    targetCharacter?.settings.linkCubeCal && !!cubeCharacter;
  const isFriend = targetCharacter && !character; // 임시

  return (
    <Modal
      title={`${targetCharacter ? `${targetCharacter.characterName}의 ` : ""}에브니 큐브 현황판`}
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
                {useCubeCharacter && cubeCharacter && <Th>캐릭터 보유</Th>}
                {!isFriend && <Th>원정대 총합</Th>}
                <Th>1레벨 보석</Th>
                <Th>보석 골드(G)</Th>
                <Th>총 골드(G)</Th>
                <Th>돌파석</Th>
                <Th>실링</Th>
                <Th>은총</Th>
                <Th>축복</Th>
                <Th>가호</Th>
                <Th>용숨</Th>
                <Th>빙숨</Th>
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
                  {useCubeCharacter && cubeCharacter && (
                    <Td>
                      {cubeCharacter[getCubeTicketKeyByName(item.name)]}장
                    </Td>
                  )}
                  {!isFriend && (
                    <Td>{totalTickets[getCubeTicketKeyByName(item.name)]}장</Td>
                  )}
                  <Td>{item.jewelry.toLocaleString()}</Td>
                  <Td>{item.jewelryPrice.toLocaleString()}</Td>
                  <Td>{(item.jewelry * item.jewelryPrice).toLocaleString()}</Td>
                  <Td>{item.leapStone.toLocaleString()}</Td>
                  <Td>{item.shilling.toLocaleString()}</Td>
                  <Td>{item.solarGrace.toLocaleString()}</Td>
                  <Td>{item.solarBlessing.toLocaleString()}</Td>
                  <Td>{item.solarProtection.toLocaleString()}</Td>
                  <Td>{item.lavasBreath.toLocaleString()}</Td>
                  <Td>{item.glaciersBreath.toLocaleString()}</Td>
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

export default CubeDashboardModal;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 700px;
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
  width: 100%;
  overflow-x: auto;

  th,
  td {
    width: 100px;
  }

  tr {
    th:first-of-type,
    td:first-of-type {
      position: sticky;
      left: 0;
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
  padding: 12px 0;
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
