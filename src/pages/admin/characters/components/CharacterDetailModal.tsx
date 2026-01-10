import type { FC } from "react";
import { useState } from "react";
import styled from "styled-components";
import { MdClose } from "@react-icons/all-files/md/MdClose";

import { AdminBadge } from "@components/admin";
import Button from "@components/Button";

interface Props {
  characterId: number;
  onClose: () => void;
}

// 목업 상세 데이터
const getMockCharacterDetail = (characterId: number) => ({
  characterId,
  memberId: Math.floor(characterId / 3) + 1,
  memberUsername: `user${String(Math.floor(characterId / 3) + 1).padStart(4, "0")}`,
  serverName: ["루페온", "실리안", "아만", "카제로스", "니나브"][characterId % 5],
  characterName: `캐릭터${characterId}`,
  characterClassName: [
    "버서커",
    "디스트로이어",
    "워로드",
    "홀리나이트",
    "슬레이어",
    "아르카나",
    "서머너",
    "바드",
    "소서리스",
    "도화가",
  ][characterId % 10],
  characterImage: "",
  itemLevel: Math.floor(Math.random() * 300) + 1500,
  characterLevel: 70,
  sortNumber: characterId % 6,
  goldCharacter: characterId % 4 === 0,
  isDeleted: characterId % 20 === 0,
  createdDate: new Date(
    Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000
  ).toISOString(),
  // 숙제 진행 상황 (목업)
  dailyContents: [
    { name: "카오스던전", completed: 2, total: 2 },
    { name: "가디언토벌", completed: 1, total: 2 },
    { name: "에포나의뢰", completed: 2, total: 3 },
  ],
  weeklyContents: [
    { name: "카멘 노말", completed: true },
    { name: "상아탑 하드", completed: false },
    { name: "일리아칸 하드", completed: true },
  ],
});

const CharacterDetailModal: FC<Props> = ({ characterId, onClose }) => {
  const character = getMockCharacterDetail(characterId);
  const [formData, setFormData] = useState({
    goldCharacter: character.goldCharacter,
    sortNumber: character.sortNumber,
  });

  const handleSave = () => {
    // TODO: API 호출
    alert("저장되었습니다. (목업)");
    onClose();
  };

  const handleSoftDelete = () => {
    if (window.confirm("이 캐릭터를 삭제 처리하시겠습니까?")) {
      // TODO: API 호출
      alert("삭제 처리되었습니다. (목업)");
      onClose();
    }
  };

  const handleHardDelete = () => {
    if (
      window.confirm(
        "이 캐릭터를 완전히 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다."
      )
    ) {
      // TODO: API 호출
      alert("완전히 삭제되었습니다. (목업)");
      onClose();
    }
  };

  const handleRestore = () => {
    if (window.confirm("이 캐릭터를 복구하시겠습니까?")) {
      // TODO: API 호출
      alert("복구되었습니다. (목업)");
      onClose();
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>캐릭터 상세 정보</ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <CharacterHeader>
            <CharacterAvatar>
              {character.characterClassName.slice(0, 2)}
            </CharacterAvatar>
            <CharacterMainInfo>
              <CharacterNameRow>
                <CharacterName>{character.characterName}</CharacterName>
                {character.isDeleted && (
                  <AdminBadge variant="error">삭제됨</AdminBadge>
                )}
                {character.goldCharacter && (
                  <AdminBadge variant="warning">골드 획득</AdminBadge>
                )}
              </CharacterNameRow>
              <CharacterSubInfo>
                {character.serverName} · {character.characterClassName} · Lv.
                {character.characterLevel}
              </CharacterSubInfo>
              <ItemLevel>아이템 레벨: {character.itemLevel.toFixed(2)}</ItemLevel>
            </CharacterMainInfo>
          </CharacterHeader>

          <Divider />

          <InfoSection>
            <InfoRow>
              <InfoLabel>캐릭터 ID</InfoLabel>
              <InfoValue>{character.characterId}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>소유자</InfoLabel>
              <InfoValue>
                {character.memberUsername} (ID: {character.memberId})
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>등록일</InfoLabel>
              <InfoValue>
                {new Date(character.createdDate).toLocaleString("ko-KR")}
              </InfoValue>
            </InfoRow>
          </InfoSection>

          <Divider />

          <FormSection>
            <FormTitle>설정 수정</FormTitle>
            <FormRow>
              <FormGroup>
                <Label>골드 획득 캐릭터</Label>
                <ToggleWrapper>
                  <ToggleButton
                    type="button"
                    $active={formData.goldCharacter}
                    onClick={() =>
                      setFormData({ ...formData, goldCharacter: true })
                    }
                  >
                    지정
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $active={!formData.goldCharacter}
                    onClick={() =>
                      setFormData({ ...formData, goldCharacter: false })
                    }
                  >
                    해제
                  </ToggleButton>
                </ToggleWrapper>
              </FormGroup>
              <FormGroup>
                <Label>정렬 순서</Label>
                <NumberInput
                  type="number"
                  min="0"
                  max="99"
                  value={formData.sortNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortNumber: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </FormGroup>
            </FormRow>
          </FormSection>

          <Divider />

          <ContentSection>
            <FormTitle>숙제 진행 현황</FormTitle>
            <ContentGrid>
              <ContentColumn>
                <ContentSubtitle>일일 콘텐츠</ContentSubtitle>
                {character.dailyContents.map((content) => (
                  <ContentItem key={content.name}>
                    <ContentName>{content.name}</ContentName>
                    <ContentProgress>
                      {content.completed}/{content.total}
                    </ContentProgress>
                  </ContentItem>
                ))}
              </ContentColumn>
              <ContentColumn>
                <ContentSubtitle>주간 콘텐츠</ContentSubtitle>
                {character.weeklyContents.map((content) => (
                  <ContentItem key={content.name}>
                    <ContentName>{content.name}</ContentName>
                    <AdminBadge
                      variant={content.completed ? "success" : "gray"}
                    >
                      {content.completed ? "완료" : "미완료"}
                    </AdminBadge>
                  </ContentItem>
                ))}
              </ContentColumn>
            </ContentGrid>
          </ContentSection>
        </ModalBody>

        <ModalFooter>
          <DeleteActions>
            {character.isDeleted ? (
              <>
                <Button variant="outlined" onClick={handleRestore}>
                  복구
                </Button>
                <Button variant="outlined" color="error" onClick={handleHardDelete}>
                  완전 삭제
                </Button>
              </>
            ) : (
              <Button variant="outlined" color="error" onClick={handleSoftDelete}>
                삭제
              </Button>
            )}
          </DeleteActions>
          <ButtonGroup>
            <Button variant="outlined" onClick={onClose}>
              취소
            </Button>
            <Button variant="contained" onClick={handleSave}>
              저장
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    </Overlay>
  );
};

export default CharacterDetailModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(2px);
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.app.bg.white};
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.app.text.light1};
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
    color: ${({ theme }) => theme.app.text.main};
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

const CharacterHeader = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const CharacterAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: white;
`;

const CharacterMainInfo = styled.div`
  flex: 1;
`;

const CharacterNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const CharacterName = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const CharacterSubInfo = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light1};
  margin: 0 0 4px 0;
`;

const ItemLevel = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.main};
  margin: 0;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  margin: 20px 0;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
`;

const InfoLabel = styled.span`
  width: 100px;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  flex-shrink: 0;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.main};
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FormTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 0 0 4px 0;
`;

const FormRow = styled.div`
  display: flex;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.light1};
`;

const ToggleWrapper = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  overflow: hidden;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active }) =>
    $active ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? "white" : theme.app.text.main};

  &:hover {
    background: ${({ $active, theme }) =>
      $active
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        : theme.app.bg.gray1};
  }
`;

const NumberInput = styled.input`
  width: 80px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ContentSection = styled.div``;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 12px;
`;

const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ContentSubtitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light1};
  margin: 0 0 4px 0;
`;

const ContentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 8px;
`;

const ContentName = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.main};
`;

const ContentProgress = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.main};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.gray1};
`;

const DeleteActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;
