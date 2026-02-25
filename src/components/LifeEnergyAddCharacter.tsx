import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";

import {
  useSaveLifeEnergy,
  useUpdateLifeEnergy,
  useUpdateLifePotions,
} from "@core/hooks/mutations/lifeEnergy.mutations";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useMyInformation from "@core/hooks/queries/member/useMyInformation";
import queryClient from "@core/lib/queryClient";
import type {
  LifeEnergySaveRequest,
  LifeEnergyUpdateRequest,
} from "@core/types/lifeEnergy";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

const POTION_CONFIG = [
  { label: "도약의 물약", field: "potionLeap" as const },
  { label: "생명의 물약(소)", field: "potionSmall" as const },
  { label: "생명의 물약(중)", field: "potionMedium" as const },
  { label: "생명의 물약(대)", field: "potionLarge" as const },
] as const;

type PotionField = typeof POTION_CONFIG[number]["field"];
type PotionValues = Record<PotionField, number>;

const invalidateMyInfo = () => {
  queryClient.invalidateQueries({
    queryKey: queryKeyGenerator.getMyInformation(),
  });
};

const LifeEnergyAddCharacter = () => {
  const { data: characters } = useCharacters(); // 계정 내 모든 캐릭터 목록
  const { data: member } = useMyInformation(); // 사용자의 생활 캐릭터 목록

  const [selectedLifeEnergyId, setSelectedLifeEnergyId] = useState<
    number | null
  >(null);
  const [characterName, setCharacterName] = useState<string>("");
  const [energy, setEnergy] = useState<number | string>("");
  const [maxEnergy, setMaxEnergy] = useState<number | string>("");
  const [beatrice, setBeatrice] = useState<boolean>(false);
  const [potionValues, setPotionValues] = useState<PotionValues>({
    potionLeap: 0,
    potionSmall: 0,
    potionMedium: 0,
    potionLarge: 0,
  });

  const currentLifeEnergy =
    member && Array.isArray(member.lifeEnergyResponses)
      ? member.lifeEnergyResponses.find(
          (le) => le.lifeEnergyId === selectedLifeEnergyId
        )
      : undefined;

  useEffect(() => {
    if (currentLifeEnergy) {
      setCharacterName(currentLifeEnergy.characterName);
      setEnergy(currentLifeEnergy.energy);
      setMaxEnergy(currentLifeEnergy.maxEnergy);
      setBeatrice(currentLifeEnergy.beatrice);
      setPotionValues({
        potionLeap: currentLifeEnergy.potionLeap,
        potionSmall: currentLifeEnergy.potionSmall,
        potionMedium: currentLifeEnergy.potionMedium,
        potionLarge: currentLifeEnergy.potionLarge,
      });
    } else {
      setCharacterName("");
      setEnergy("");
      setMaxEnergy("");
      setBeatrice(false);
      setPotionValues({
        potionLeap: 0,
        potionSmall: 0,
        potionMedium: 0,
        potionLarge: 0,
      });
    }
  }, [selectedLifeEnergyId, currentLifeEnergy]);

  const saveLifeEnergyMutation = useSaveLifeEnergy({
    onSuccess: () => {
      invalidateMyInfo();
      toast.success("생활의 기운이 성공적으로 추가되었습니다.");
      setSelectedLifeEnergyId(null);
      setCharacterName("");
      setEnergy("");
      setMaxEnergy("");
      setBeatrice(false);
    },
    onError: (error) => {
      toast.error(`생활의 기운 추가에 실패했습니다`);
      // eslint-disable-next-line no-console
      console.error("생활의 기운 추가 오류:", error);
    },
  });

  const updateLifeEnergyMutation = useUpdateLifeEnergy({
    onSuccess: () => {
      invalidateMyInfo();
      toast.success("생활의 기운이 성공적으로 업데이트되었습니다.");
    },
    onError: (error) => {
      toast.error(`생활의 기운 업데이트에 실패했습니다`);
      // eslint-disable-next-line no-console
      console.error("생활의 기운 업데이트 오류:", error);
    },
  });

  const updatePotionsMutation = useUpdateLifePotions({
    onSuccess: () => {
      invalidateMyInfo();
      toast.success("물약 재고가 저장되었습니다.");
    },
    onError: () => toast.error("물약 재고 저장에 실패했습니다."),
  });

  const handlePotionChange = (field: PotionField, value: string) => {
    let num = value.replace(/[^0-9]/g, "");
    if (num.startsWith("0") && num.length > 1) {
      num = num.slice(1);
    }
    if (Number(num) > 999) {
      num = "999";
    }
    setPotionValues((prev) => ({ ...prev, [field]: Number(num) }));
  };

  const handlePotionSave = () => {
    if (!selectedLifeEnergyId) return;
    updatePotionsMutation.mutate({
      lifeEnergyId: selectedLifeEnergyId,
      ...potionValues,
    });
  };

  const isPotionDirty = currentLifeEnergy
    ? POTION_CONFIG.some(
        ({ field }) => potionValues[field] !== currentLifeEnergy[field]
      )
    : false;

  const handleSubmit = () => {
    const parsedEnergy =
      typeof energy === "string" ? parseInt(energy, 10) : energy;
    const parsedMaxEnergy =
      typeof maxEnergy === "string" ? parseInt(maxEnergy, 10) : maxEnergy;

    if (
      !characterName ||
      Number.isNaN(parsedEnergy) ||
      Number.isNaN(parsedMaxEnergy)
    ) {
      toast.error(
        "모든 필드를 올바르게 입력해주세요. 캐릭터를 선택했는지 확인해주세요."
      );
      return;
    }

    // energy > maxEnergy 검증 제거: 물약 사용 시 maxEnergy 초과 가능
    if (selectedLifeEnergyId) {
      const updateData: LifeEnergyUpdateRequest = {
        id: selectedLifeEnergyId, // API 요청 시에는 id로 보낼 수 있음. 백엔드 DTO에 맞게 조정 필요
        energy: parsedEnergy,
        maxEnergy: parsedMaxEnergy,
        characterName,
        beatrice,
      };
      updateLifeEnergyMutation.mutate(updateData);
    } else {
      const saveData: LifeEnergySaveRequest = {
        energy: parsedEnergy,
        maxEnergy: parsedMaxEnergy,
        characterName,
        beatrice,
      };
      saveLifeEnergyMutation.mutate(saveData);
    }
  };

  if (!characters || !member) {
    return (
      <Container>
        <NoDataMessage>데이터를 불러오는 중입니다...</NoDataMessage>
      </Container>
    );
  }

  const registeredLifeEnergyNames = new Set(
    Array.isArray(member.lifeEnergyResponses)
      ? member.lifeEnergyResponses.map((le) => le.characterName)
      : []
  );

  return (
    <Container>
      <Section>
        <Title>캐릭터 선택</Title>
        <SelectContainer>
          <CharacterSelect
            value={selectedLifeEnergyId || ""}
            onChange={(e) => {
              const id = e.target.value === "" ? null : Number(e.target.value);
              setSelectedLifeEnergyId(id);
            }}
          >
            <option value="">
              {selectedLifeEnergyId === null
                ? "-- 기존 생활 캐릭터 수정 --"
                : currentLifeEnergy?.characterName ||
                  "-- 기존 생활 캐릭터 수정 --"}{" "}
              {selectedLifeEnergyId !== null &&
                currentLifeEnergy &&
                "(수정 중)"}
            </option>
            {Array.isArray(member.lifeEnergyResponses) &&
            member.lifeEnergyResponses.length > 0 ? (
              member.lifeEnergyResponses.map((lifeEnergy) => (
                <option
                  key={`le-${lifeEnergy.lifeEnergyId}`}
                  value={lifeEnergy.lifeEnergyId}
                >
                  {lifeEnergy.characterName}
                </option>
              ))
            ) : (
              <option value="" disabled>
                등록된 생활 캐릭터 없음
              </option>
            )}
          </CharacterSelect>
          <ResetButton onClick={() => setSelectedLifeEnergyId(null)}>
            새로운 입력
          </ResetButton>
        </SelectContainer>
      </Section>

      <Section>
        <Title>생활의 기운 정보</Title>
        <InputGroup>
          <InputLabel>캐릭터 이름</InputLabel>
          {selectedLifeEnergyId === null ? (
            <CharacterSelect
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
            >
              <option value="">-- 캐릭터를 선택해주세요 --</option>
              {characters.map((character) => (
                <option
                  key={`char-${character.characterId}`}
                  value={character.characterName}
                  disabled={registeredLifeEnergyNames.has(
                    character.characterName
                  )}
                  title={
                    registeredLifeEnergyNames.has(character.characterName)
                      ? "이미 생활 기운으로 등록된 캐릭터입니다."
                      : undefined
                  }
                >
                  {character.characterName}
                  {registeredLifeEnergyNames.has(character.characterName) &&
                    " (등록됨)"}
                </option>
              ))}
            </CharacterSelect>
          ) : (
            <InputField type="text" value={characterName} readOnly disabled />
          )}
        </InputGroup>
        <InputGroup>
          <InputLabel>현재 기운</InputLabel>
          <InputField
            type="number"
            value={energy}
            onChange={(e) => setEnergy(e.target.value)}
            placeholder="현재 기운"
          />
        </InputGroup>
        <InputGroup>
          <InputLabel>최대 기운</InputLabel>
          <InputField
            type="number"
            value={maxEnergy}
            onChange={(e) => setMaxEnergy(e.target.value)}
            placeholder="최대 기운"
          />
        </InputGroup>
        <BeatriceCheckboxContainer>
          <CheckboxLabel htmlFor="beatrice-toggle">베아트리스</CheckboxLabel>
          <ToggleSwitch>
            <input
              type="checkbox"
              id="beatrice-toggle"
              checked={beatrice}
              onChange={(e) => setBeatrice(e.target.checked)}
            />
            <Slider />
          </ToggleSwitch>
          <InfoText>
            베아트리스 체크시 30분당 99, 미체크시 30분당 90 증가합니다.
          </InfoText>
        </BeatriceCheckboxContainer>
      </Section>

      {selectedLifeEnergyId && currentLifeEnergy && (
        <Section>
          <Title>물약 재고</Title>
          <PotionList>
            {POTION_CONFIG.map(({ label, field }) => (
              <PotionRow key={field}>
                <PotionLabel>{label}</PotionLabel>
                <PotionCounter>
                  <PotionButton
                    disabled={potionValues[field] <= 0}
                    onClick={() =>
                      setPotionValues((prev) => ({
                        ...prev,
                        [field]: Math.max(0, prev[field] - 1),
                      }))
                    }
                  >
                    <FiMinus />
                  </PotionButton>
                  <PotionInput
                    value={potionValues[field]}
                    onChange={(e) => handlePotionChange(field, e.target.value)}
                  />
                  <PotionButton
                    disabled={potionValues[field] >= 999}
                    onClick={() =>
                      setPotionValues((prev) => ({
                        ...prev,
                        [field]: Math.min(999, prev[field] + 1),
                      }))
                    }
                  >
                    <FiPlus />
                  </PotionButton>
                </PotionCounter>
              </PotionRow>
            ))}
          </PotionList>
          <PotionSaveButton
            disabled={!isPotionDirty}
            onClick={handlePotionSave}
          >
            물약 저장
          </PotionSaveButton>
        </Section>
      )}

      <SubmitButton onClick={handleSubmit}>
        {selectedLifeEnergyId ? "정보 업데이트" : "정보 저장"}
      </SubmitButton>
    </Container>
  );
};

export default LifeEnergyAddCharacter;

// 스타일 컴포넌트
const Container = styled.div`
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: 20px;
  padding: 18px 20px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.app.bg.gray1};

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.app.text.light1};
  text-align: center;
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
`;

const CharacterSelect = styled.select`
  padding: 12px 15px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.app.bg.gray2};
  color: ${({ theme }) => theme.app.text.light1};
  width: 100%;
  appearance: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.app.bg.gray1};
  }
`;

const ResetButton = styled.button`
  padding: 12px 15px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.app.palette.gray[700]};
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.app.palette.gray[600]};
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 15px;
`;

export const InputLabel = styled.label`
  display: block;
  font-size: 15px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.app.text.light2};
`;

export const InputField = styled.input`
  padding: 12px 15px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.app.text.light1};
  background-color: ${({ theme }) => theme.app.bg.gray2};
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light2};
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.app.palette.blue[0]};
    box-shadow: 0 0 0 2px rgba(0, 153, 255, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.app.bg.gray1};
  }
`;

// 베아트리스 체크박스 컨테이너 (이전 CheckboxContainer에서 이름 변경 및 스타일 조정)
const BeatriceCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding-bottom: 10px;
  flex-wrap: wrap; /* 내용이 길어지면 줄바꿈 허용 */
  gap: 10px; /* 요소 간 기본 간격 */
`;

const CheckboxLabel = styled.label`
  font-size: 18px;
  color: ${({ theme }) => theme.app.text.light1};
  cursor: pointer;
  white-space: nowrap; /* 라벨은 줄바꿈 안되도록 */
  flex-shrink: 0;
  margin-left: 10px;
`;

// 토글 스위치 외형을 위한 스타일 컴포넌트
const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px; /* 스위치 전체 너비 */
  height: 28px; /* 스위치 전체 높이 */
  margin-left: 10px; /* 라벨과의 간격 */
  flex-shrink: 0; /* 스위치가 줄어들지 않도록 */

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input:checked + span {
    background-color: #00ff99; /* 체크 시 배경색 */
  }

  input:focus + span {
    box-shadow: 0 0 1px #00ff99;
  }

  input:checked + span:before {
    transform: translateX(20px); /* 체크 시 버튼 이동 */
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) =>
    theme.app.palette.gray[500]}; /* 기본 배경색 */
  transition: 0.4s;
  border-radius: 28px; /* 스위치 전체 둥글게 */

  &:before {
    position: absolute;
    content: "";
    height: 20px; /* 버튼 높이 */
    width: 20px; /* 버튼 너비 */
    left: 4px; /* 버튼 좌측 여백 */
    bottom: 4px; /* 버튼 하단 여백 */
    background-color: white;
    transition: 0.4s;
    border-radius: 50%; /* 버튼 둥글게 */
  }
`;

const InfoText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};
  margin-left: 10px; /* 스위치와의 간격 */
  line-height: 1.4;
  flex-grow: 1;
`;

const SubmitButton = styled.button`
  padding: 14px 20px;
  font-size: 18px;
  font-weight: bold;
  background-color: #00ff99;
  color: ${({ theme }) => theme.app.text.dark2};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  margin-top: 30px;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;

  &:hover {
    background-color: #00e68a;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PotionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PotionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PotionLabel = styled.span`
  font-size: 15px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const PotionCounter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PotionInput = styled.input`
  width: 50px;
  height: 30px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.app.text.light1};
  background: ${({ theme }) => theme.app.bg.gray2};
`;

const PotionSaveButton = styled.button<{ disabled?: boolean }>`
  margin-top: 15px;
  padding: 10px;
  width: 100%;
  font-size: 15px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  background-color: ${({ disabled }) => (disabled ? "#555" : "#00ff99")};
  color: ${({ disabled, theme }) =>
    disabled ? theme.app.text.light2 : theme.app.text.dark2};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #00e68a;
  }
`;

const PotionButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.gray2};
  color: ${({ theme, disabled }) =>
    disabled ? theme.app.text.light2 : theme.app.text.main};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  font-size: 14px;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.app.bg.gray1};
  }
`;

const NoDataMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  color: ${({ theme }) => theme.app.text.light2};
  font-size: 15px;
  text-align: center;
  margin-top: 10px;
  border: 1px dashed ${({ theme }) => theme.app.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.app.bg.gray2};
`;
