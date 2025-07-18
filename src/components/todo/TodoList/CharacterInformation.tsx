import { Tooltip } from "@mui/material";
import { FaCoins } from "@react-icons/all-files/fa/FaCoins";
import { FiRefreshCcw } from "@react-icons/all-files/fi/FiRefreshCcw";
import { IoTrashOutline } from "@react-icons/all-files/io5/IoTrashOutline";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";

import useUpdateCharacter from "@core/hooks/mutations/character/useUpdateCharacter";
import useUpdateCharacterName from "@core/hooks/mutations/character/useUpdateCharacterName";
import useUpdateCharacterStatus from "@core/hooks/mutations/character/useUpdateCharacterStatus";
import { useUpdateCharacterMemo } from "@core/hooks/mutations/todo";
import useIsGuest from "@core/hooks/useIsGuest";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import { getIsSpecialist } from "@core/utils";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import Modal from "@components/Modal";
import MultilineInput from "@components/todo/TodoList/element/MultilineInput";

import AddMemoIcon from "@assets/svg/AddMemoIcon";
import SaveIcon from "@assets/svg/SaveIcon";

interface Props {
  isSetting?: boolean;
  character: Character;
  friend?: Friend;
}

const CharacterInformation = ({ isSetting, character, friend }: Props) => {
  const queryClient = useQueryClient();
  const memoRef = useRef<HTMLTextAreaElement>(null);
  const isGuest = useIsGuest();
  const [removeCharacterModal, setRemoveCharacterModal] = useState(false);
  const [editMemo, setEditMemo] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null); // 닉네임 입력용 ref 추가
  const [editName, setEditName] = useState(false); // 닉네임 편집 상태 추가

  const updateCharacterMemo = useUpdateCharacterMemo({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });

      setEditMemo(false);
    },
  });

  const updateCharacterName = useUpdateCharacterName({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });

      setEditName(false);
      toast.success("캐릭터 닉네임 변경을 완료했습니다.");
    },
  });

  const removeCharacter = useUpdateCharacterStatus({
    onSuccess: () => {
      toast.success(`"${character.characterName}" 캐릭터를 삭제했습니다.`);

      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getDeletedCharacters(), // 삭제된 캐릭터 쿼리 키
      });
    },
  });

  const submitMemo = () => {
    if (memoRef.current) {
      updateCharacterMemo.mutate({
        friendUsername: friend?.friendUsername,
        characterId: character.characterId,
        memo: memoRef.current.value,
      });
    }
  };

  const submitName = () => {
    if (nameInputRef.current) {
      const newName = nameInputRef.current.value.trim();
      if (newName && newName !== character.characterName) {
        updateCharacterName.mutate({
          friendUsername: friend?.friendUsername,
          characterId: character.characterId,
          characterName: newName,
        });
      } else {
        setEditName(false); // 변경 없으면 편집 모드만 종료
      }
    }
  };

  const updateCharacter = useUpdateCharacter({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });
      toast.success("캐릭터 업데이트가 완료되었습니다.");
    },
  });

  return (
    <Wrapper>
      <Modal
        title="캐릭터 삭제"
        isOpen={removeCharacterModal}
        onClose={() => setRemoveCharacterModal(false)}
        buttons={[
          {
            onClick: () => removeCharacter.mutate(character.characterId),
            label: "삭제",
          },
          {
            onClick: () => setRemoveCharacterModal(false),
            label: "취소",
          },
        ]}
      >
        <RemoveCaution>
          <RemoveCaution>
            <strong>필독</strong>
            <span>
              해당 기능은 닉네임 변경으로 자투리 캐릭터가 생겼을 때 삭제하기
              위한 기능입니다.
            </span>
            <span>
              삭제된 캐릭터는 관리자에게 요청 후 복구해야하므로 상당한 시간이
              필요합니다.
            </span>
            <span>
              [캐릭터 숨김]을 원하시는 경우 [캐릭터 출력] 스위치를 통해
              미출력으로 변경해 주시기를 바랍니다.
            </span>
          </RemoveCaution>
        </RemoveCaution>
      </Modal>

      <CharacterBox
        style={{
          backgroundImage:
            character.characterImage !== null
              ? `url(${character.characterImage})`
              : undefined,
          backgroundPosition: getIsSpecialist(character.characterClassName)
            ? "left 10px top -80px"
            : "left 10px top -30px",
        }}
      >
        <Server>
          @{character.serverName} {character.characterClassName}
        </Server>
        {editName ? (
          <NameInputWrapper>
            <NameInput
              ref={nameInputRef}
              defaultValue={character.characterName}
              onBlur={submitName} // 포커스 잃으면 저장
              onKeyPress={(e) => {
                if (e.key === "Enter") submitName(); // Enter 키로도 저장
              }}
              autoFocus
            />
          </NameInputWrapper>
        ) : (
          <NicknameContainer>
            <Tooltip
              title={<>더블 클릭시 닉네임 변경이 가능합니다.</>}
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -80],
                    },
                  },
                ],
              }}
            >
              <Nickname onDoubleClick={() => setEditName(true)}>
                {character.characterName}
              </Nickname>
            </Tooltip>
            {character.goldCharacter && (
              <Tooltip title="골드 획득 지정">
                <GoldBadge>
                  <FaCoins />
                </GoldBadge>
              </Tooltip>
            )}
          </NicknameContainer>
        )}
        <StatsContainer>
          <StatRow>
            <Button
              key={character.characterId}
              css={refreshButtonCss}
              variant="icon"
              size={18}
              onClick={() => {
                if (isGuest) {
                  toast.warn("테스트 계정은 이용하실 수 없습니다.");
                  return;
                }
                updateCharacter.mutate({
                  friendUsername: friend?.friendUsername,
                  characterId: character.characterId,
                });
              }}
            >
              <FiRefreshCcw />
            </Button>
            <StatItem>
              <ItemLevelValue>Lv. {character.itemLevel}</ItemLevelValue>
            </StatItem>
          </StatRow>
          <StatItem>
            <CombatPowerBadge>전투력</CombatPowerBadge>
            <CombatPowerValue>
              {character.combatPower?.toLocaleString() || "0"}
            </CombatPowerValue>
          </StatItem>
        </StatsContainer>
        <Buttons>
          {isSetting ? (
            <Button
              css={buttonCss}
              variant="icon"
              size={20}
              onClick={() => {
                if (isGuest) {
                  toast.warn("테스트 계정은 이용하실 수 없습니다.");
                  return;
                }

                setRemoveCharacterModal(true);
              }}
            >
              <IoTrashOutline />
            </Button>
          ) : (
            <>
              {editMemo ? (
                <Button
                  css={buttonCss}
                  variant="icon"
                  size={18}
                  onClick={submitMemo}
                >
                  <SaveIcon />
                </Button>
              ) : (
                <Button
                  css={buttonCss}
                  variant="icon"
                  size={18}
                  onClick={() => {
                    if (isGuest) {
                      toast.warn("테스트 계정은 이용하실 수 없습니다.");
                      return;
                    }

                    setEditMemo(true);
                    memoRef.current?.focus();
                  }}
                >
                  <AddMemoIcon />
                </Button>
              )}
            </>
          )}
        </Buttons>
      </CharacterBox>
      {!isSetting && (
        <MultilineInput
          ref={memoRef}
          inputCss={memoInputCss}
          onEnterPress={submitMemo}
          onClick={() => {
            setEditMemo(true);
          }}
          isHidden={character.memo === null && !editMemo}
          placeholder="메모 추가"
          defaultValue={character.memo || ""}
          maxLength={100}
        />
      )}
    </Wrapper>
  );
};

export default CharacterInformation;

const Wrapper = styled.div``;

const RemoveCaution = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  color: ${({ theme }) => theme.app.text.black};

  strong {
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.app.text.red};
  }
`;

const memoInputCss = css`
  padding: 5px 10px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-bottom: none;
  background: ${({ theme }) => theme.app.bg.white};

  &:disabled {
    cursor: default;
  }
`;

const CharacterBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 15px;
  height: 110px;
  border-radius: 7px 7px 0 0;
  line-height: 1.2;
  color: ${({ theme }) => theme.app.palette.gray[0]};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-bottom: none;
  background-color: ${({ theme }) => theme.app.palette.gray[500]};
  background-size: 150%;

  // 왼쪽 50% 흐림 처리용 오버레이
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 70%;
    height: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.4), transparent);
    z-index: 1;
    pointer-events: none;
  }

  // 오버레이 위로 글자 노출
  > * {
    position: relative;
    z-index: 2;
  }
`;

const GoldBadge = styled.div`
  color: ${({ theme }) => theme.app.palette.yellow[350]};
  font-size: 16px;
  cursor: help;
`;

const Server = styled.span`
  margin-bottom: 6px;
  font-size: 12px;
`;

const NicknameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 3px;
`;

const Nickname = styled.span`
  font-size: 16px;
  cursor: pointer;
`;

const NameInputWrapper = styled.div`
  margin-bottom: 3px;
`;

const NameInput = styled.input`
  font-size: 16px;
  padding: 2px 5px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 3px;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.black};
  width: 100%;
  max-width: 150px; /* 입력 필드 크기 제한 */
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StatItem = styled.span`
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ItemLevelValue = styled.span`
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.6); // 반투명 어두운 배경
  padding: 2px 6px;
  border-radius: 4px;
`;

const CombatPowerBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background: linear-gradient(135deg, #ff8c42, #ff6b1a);
  color: white;
  font-size: 10px;
  font-weight: bold;
  border-radius: 10px;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(255, 107, 26, 0.3);
`;

const CombatPowerValue = styled.span`
  color: #ffb366;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.6); // 반투명 어두운 배경
  padding: 2px 6px;
  border-radius: 4px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 5px 0 0 0;
  overflow: hidden;
  button {
    background: rgba(0, 0, 0, 0.6) !important;
  }
`;

const buttonCss = css`
  padding: 5px;
  border-radius: 0;
  color: ${({ theme }) => theme.app.palette.gray[0]};
`;

const refreshButtonCss = css`
  color: ${({ theme }) => theme.app.palette.gray[0]};
  background: rgba(0, 0, 0, 0);
  padding: 0px;
  width: 15px;
  margin-left: 5px;
  bottom: 1px;
`;
