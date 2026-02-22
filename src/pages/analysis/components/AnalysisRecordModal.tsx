/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from "react";
import styled from "styled-components";

import useCreateAnalysis from "@core/hooks/mutations/analysis/useCreateAnalysis";
import useCharacters from "@core/hooks/queries/character/useCharacters";

import Button from "@components/Button";
import Modal from "@components/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface CustomRow {
  id: number;
  key: string;
  value: number;
}

const AnalysisRecordModal = ({ isOpen, onClose }: Props) => {
  const { data: characters } = useCharacters();
  const { mutate: createAnalysis } = useCreateAnalysis();

  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(
    null
  );
  const [contentName, setContentName] = useState("");
  const [contentDate, setContentDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [damage, setDamage] = useState(0);
  const [dps, setDps] = useState(0);
  const [customRows, setCustomRows] = useState<CustomRow[]>([]);

  const handleAddRow = () => {
    setCustomRows([...customRows, { id: Date.now(), key: "", value: 0 }]);
  };

  const handleRemoveRow = (id: number) => {
    setCustomRows(customRows.filter((row) => row.id !== id));
  };

  const handleCustomRowChange = (id: number, key: string, value: number) => {
    setCustomRows(
      customRows.map((row) => (row.id === id ? { ...row, key, value } : row))
    );
  };

  const handleSubmit = () => {
    if (!selectedCharacter) {
      alert("캐릭터를 선택해주세요.");
      return;
    }

    const character = characters?.find(
      (c) => c.characterId === selectedCharacter
    );

    if (!character) {
      alert("캐릭터 정보를 찾을 수 없습니다.");
      return;
    }

    const customData = customRows.reduce(
      (acc, row) => {
        acc[row.key] = row.value;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalSeconds = minutes * 60 + seconds;

    createAnalysis(
      {
        characterId: character.characterId,
        characterName: character.characterName,
        className: character.characterClassName,
        itemLevel: character.itemLevel,
        combatPower: character.combatPower,
        contentName,
        contentDate,
        battleTime: totalSeconds,
        damage,
        dps,
        customData,
      },
      {
        onSuccess: () => {
          alert("기록되었습니다.");
          onClose();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="전투 분석 기록">
      <Wrapper>
        <Row>
          <Label>캐릭터 선택</Label>
          <Select
            onChange={(e) => setSelectedCharacter(Number(e.target.value))}
          >
            <option value="">캐릭터 선택</option>
            {characters?.map((character) => (
              <option key={character.characterId} value={character.characterId}>
                {character.characterName}
              </option>
            ))}
          </Select>
        </Row>
        {selectedCharacter && (
          <CharacterInfo>
            <InfoItem>
              이름:{" "}
              {
                characters?.find((c) => c.characterId === selectedCharacter)
                  ?.characterName
              }
            </InfoItem>
            <InfoItem>
              직업:{" "}
              {
                characters?.find((c) => c.characterId === selectedCharacter)
                  ?.characterClassName
              }
            </InfoItem>
            <InfoItem>
              아이템 레벨:{" "}
              {
                characters?.find((c) => c.characterId === selectedCharacter)
                  ?.itemLevel
              }
            </InfoItem>
            <InfoItem>
              전투력:{" "}
              {
                characters?.find((c) => c.characterId === selectedCharacter)
                  ?.combatPower
              }
            </InfoItem>
          </CharacterInfo>
        )}
        <Row>
          <Label>컨텐츠 이름</Label>
          <Input
            type="text"
            value={contentName}
            onChange={(e) => setContentName(e.target.value)}
          />
        </Row>
        <Row>
          <Label>컨텐츠 날짜</Label>
          <Input
            type="date"
            value={contentDate}
            onChange={(e) => setContentDate(e.target.value)}
          />
        </Row>
        <Row>
          <Label>전투 시간</Label>
          <TimeInputWrapper>
            <Input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            />
            <span>분</span>
            <Input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(Number(e.target.value))}
            />
            <span>초</span>
          </TimeInputWrapper>
        </Row>
        <Row>
          <Label>피해량</Label>
          <Input
            type="number"
            value={damage}
            onChange={(e) => setDamage(Number(e.target.value))}
          />
        </Row>
        <Row>
          <Label>초당 피해량</Label>
          <Input
            type="number"
            value={dps}
            onChange={(e) => setDps(Number(e.target.value))}
          />
        </Row>
        <Divider />
        <CustomRowsWrapper>
          <h3>사용자 정의 항목</h3>
          <Button type="button" onClick={handleAddRow} variant="outlined">
            항목 추가
          </Button>
          {customRows.map((row) => (
            <CustomRowWrapper key={row.id}>
              <Input
                type="text"
                placeholder="항목 이름"
                value={row.key}
                onChange={(e) =>
                  handleCustomRowChange(row.id, e.target.value, row.value)
                }
              />
              <Input
                type="number"
                placeholder="값"
                value={row.value}
                onChange={(e) =>
                  handleCustomRowChange(row.id, row.key, Number(e.target.value))
                }
              />
              <Button
                type="button"
                onClick={() => handleRemoveRow(row.id)}
                variant="contained"
                color="error"
              >
                삭제
              </Button>
            </CustomRowWrapper>
          ))}
        </CustomRowsWrapper>
        <Divider />
        <Button type="button" onClick={handleSubmit} variant="contained">
          완료
        </Button>
      </Wrapper>
    </Modal>
  );
};

export default AnalysisRecordModal;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${({ theme }) => theme.app.text.main};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.label`
  width: 100px;
  font-weight: bold;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
`;

const Select = styled.select`
  flex: 1;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
`;

const CharacterInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.app.bg.gray1};
`;

const InfoItem = styled.p`
  margin: 0;
`;

const TimeInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  margin: 16px 0;
`;

const CustomRowsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CustomRowWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
