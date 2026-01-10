import type { FC } from "react";
import { useState, useEffect } from "react";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { toast } from "react-toastify";

import { AdminBadge } from "@components/admin";
import Button from "@components/Button";
import { useCharacter, useUpdateCharacter, useDeleteCharacter } from "../hooks/useCharacters";
import CharacterTodoSection from "./CharacterTodoSection";
import {
  Overlay,
  Modal,
  LoadingWrapper,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter,
  DeleteActions,
  ButtonGroup,
  Divider,
  CharacterHeader,
  CharacterAvatar,
  CharacterMainInfo,
  CharacterNameRow,
  CharacterName,
  CharacterSubInfo,
  ItemLevel,
  InfoSection,
  InfoRow,
  InfoLabel,
  InfoValue,
  FormSection,
  FormTitle,
  FormRow,
  FormGroup,
  Label,
  Input,
  ToggleWrapper,
  ToggleButton,
  NumberInput,
} from "./CharacterDetailModal.styles";

interface Props {
  characterId: number;
  onClose: () => void;
}

const CharacterDetailModal: FC<Props> = ({ characterId, onClose }) => {
  const { data: character, isLoading } = useCharacter(characterId);
  const updateCharacter = useUpdateCharacter();
  const deleteCharacter = useDeleteCharacter();

  const [formData, setFormData] = useState({
    goldCharacter: false,
    sortNumber: 0,
    memo: "",
  });

  useEffect(() => {
    if (character) {
      setFormData({
        goldCharacter: character.goldCharacter,
        sortNumber: character.sortNumber,
        memo: character.memo || "",
      });
    }
  }, [character]);

  const handleSave = async () => {
    try {
      await updateCharacter.mutateAsync({
        characterId,
        data: {
          goldCharacter: formData.goldCharacter,
          sortNumber: formData.sortNumber,
          memo: formData.memo || undefined,
        },
      });
      toast.success("저장되었습니다.");
      onClose();
    } catch {
      // 에러는 axios interceptor에서 처리됨
    }
  };

  const handleSoftDelete = async () => {
    if (window.confirm("이 캐릭터를 삭제 처리하시겠습니까?")) {
      try {
        await deleteCharacter.mutateAsync({ characterId, hardDelete: false });
        toast.success("삭제 처리되었습니다.");
        onClose();
      } catch {
        // 에러는 axios interceptor에서 처리됨
      }
    }
  };

  const handleHardDelete = async () => {
    if (
      window.confirm(
        "이 캐릭터를 완전히 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다."
      )
    ) {
      try {
        await deleteCharacter.mutateAsync({ characterId, hardDelete: true });
        toast.success("완전히 삭제되었습니다.");
        onClose();
      } catch {
        // 에러는 axios interceptor에서 처리됨
      }
    }
  };

  const handleRestore = async () => {
    if (window.confirm("이 캐릭터를 복구하시겠습니까?")) {
      try {
        await updateCharacter.mutateAsync({
          characterId,
          data: { isDeleted: false },
        });
        toast.success("복구되었습니다.");
        onClose();
      } catch {
        // 에러는 axios interceptor에서 처리됨
      }
    }
  };

  if (isLoading || !character) {
    return (
      <Overlay onClick={onClose}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <LoadingWrapper>불러오는 중...</LoadingWrapper>
        </Modal>
      </Overlay>
    );
  }

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
            <FormGroup>
              <Label>메모</Label>
              <Input
                type="text"
                value={formData.memo}
                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                placeholder="메모 (최대 100자)"
                maxLength={100}
              />
            </FormGroup>
          </FormSection>

          {character.dayTodo && (
            <CharacterTodoSection
              dayTodo={character.dayTodo}
              weekTodo={character.weekTodo}
            />
          )}
        </ModalBody>

        <ModalFooter>
          <DeleteActions>
            {character.isDeleted ? (
              <>
                <Button
                  variant="outlined"
                  onClick={handleRestore}
                  disabled={updateCharacter.isPending}
                >
                  복구
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleHardDelete}
                  disabled={deleteCharacter.isPending}
                >
                  완전 삭제
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                color="error"
                onClick={handleSoftDelete}
                disabled={deleteCharacter.isPending}
              >
                삭제
              </Button>
            )}
          </DeleteActions>
          <ButtonGroup>
            <Button variant="outlined" onClick={onClose}>
              취소
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={updateCharacter.isPending}
            >
              {updateCharacter.isPending ? "저장 중..." : "저장"}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    </Overlay>
  );
};

export default CharacterDetailModal;
