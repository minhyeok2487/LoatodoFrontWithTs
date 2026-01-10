import type { FC } from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { toast } from "react-toastify";

import { AdminBadge } from "@components/admin";
import Button from "@components/Button";
import type { MemberRole } from "@core/types/admin";
import { useMember, useUpdateMember, useDeleteMember } from "../hooks/useMembers";

interface Props {
  memberId: number;
  onClose: () => void;
}

const MemberDetailModal: FC<Props> = ({ memberId, onClose }) => {
  const { data: member, isLoading } = useMember(memberId);
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();

  const [formData, setFormData] = useState({
    role: "USER" as MemberRole,
    mainCharacter: "",
    adsDate: "",
  });

  useEffect(() => {
    if (member) {
      setFormData({
        role: member.role,
        mainCharacter: member.mainCharacter || "",
        adsDate: member.adsDate?.slice(0, 16) || "",
      });
    }
  }, [member]);

  const handleSave = async () => {
    try {
      await updateMember.mutateAsync({
        memberId,
        data: {
          role: formData.role,
          mainCharacter: formData.mainCharacter || undefined,
          adsDate: formData.adsDate || undefined,
        },
      });
      toast.success("저장되었습니다.");
      onClose();
    } catch {
      // 에러는 axios interceptor에서 처리됨
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 회원을 삭제하시겠습니까?\n연관된 모든 데이터가 함께 삭제됩니다.")) {
      try {
        await deleteMember.mutateAsync(memberId);
        toast.success("삭제되었습니다.");
        onClose();
      } catch {
        // 에러는 axios interceptor에서 처리됨
      }
    }
  };

  if (isLoading || !member) {
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
          <ModalTitle>회원 상세 정보</ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <InfoSection>
            <InfoRow>
              <InfoLabel>회원 ID</InfoLabel>
              <InfoValue>{member.memberId}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>아이디</InfoLabel>
              <InfoValue>{member.username}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>가입 방식</InfoLabel>
              <InfoValue>
                <AdminBadge variant={member.authProvider === "google" ? "primary" : "gray"}>
                  {member.authProvider === "google" ? "Google" : "일반"}
                </AdminBadge>
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>가입일</InfoLabel>
              <InfoValue>
                {new Date(member.createdDate).toLocaleString("ko-KR")}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>API Key</InfoLabel>
              <InfoValue>
                {member.apiKey ? (
                  <ApiKeyText>{member.apiKey}</ApiKeyText>
                ) : (
                  <EmptyText>미등록</EmptyText>
                )}
              </InfoValue>
            </InfoRow>
          </InfoSection>

          <Divider />

          <FormSection>
            <FormTitle>정보 수정</FormTitle>
            <FormGroup>
              <Label>권한</Label>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as MemberRole })}
              >
                <option value="USER">일반</option>
                <option value="PUBLISHER">퍼블리셔</option>
                <option value="ADMIN">관리자</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>대표 캐릭터</Label>
              <Input
                type="text"
                value={formData.mainCharacter}
                onChange={(e) => setFormData({ ...formData, mainCharacter: e.target.value })}
                placeholder="대표 캐릭터명"
              />
            </FormGroup>
            <FormGroup>
              <Label>광고 제거 만료일</Label>
              <Input
                type="datetime-local"
                value={formData.adsDate}
                onChange={(e) => setFormData({ ...formData, adsDate: e.target.value })}
              />
            </FormGroup>
          </FormSection>

          <Divider />

          <CharacterSection>
            <FormTitle>보유 캐릭터 ({member.characters?.length ?? 0})</FormTitle>
            <CharacterList>
              {member.characters?.map((char) => (
                <CharacterItem key={char.characterId}>
                  <CharacterName>{char.characterName}</CharacterName>
                  <CharacterInfo>
                    {char.serverName} · {char.characterClassName} · {char.itemLevel.toFixed(2)}
                  </CharacterInfo>
                </CharacterItem>
              ))}
              {(!member.characters || member.characters.length === 0) && (
                <EmptyCharacters>등록된 캐릭터가 없습니다.</EmptyCharacters>
              )}
            </CharacterList>
          </CharacterSection>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDelete}
            disabled={deleteMember.isPending}
          >
            회원 삭제
          </Button>
          <ButtonGroup>
            <Button variant="outlined" onClick={onClose}>
              취소
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={updateMember.isPending}
            >
              {updateMember.isPending ? "저장 중..." : "저장"}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    </Overlay>
  );
};

export default MemberDetailModal;

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
  max-width: 560px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: ${({ theme }) => theme.app.text.light1};
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

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
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

const ApiKeyText = styled.span`
  font-family: monospace;
  font-size: 12px;
  background: ${({ theme }) => theme.app.bg.gray1};
  padding: 4px 8px;
  border-radius: 4px;
  word-break: break-all;
  line-height: 1.6;
`;

const EmptyText = styled.span`
  color: ${({ theme }) => theme.app.text.light2};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  margin: 20px 0;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 0 0 4px 0;
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

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const CharacterSection = styled.div``;

const CharacterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  max-height: 200px;
  overflow-y: auto;
`;

const CharacterItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 8px;
`;

const CharacterName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.main};
`;

const CharacterInfo = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const EmptyCharacters = styled.div`
  text-align: center;
  padding: 20px;
  color: ${({ theme }) => theme.app.text.light2};
  font-size: 14px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.gray1};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;
