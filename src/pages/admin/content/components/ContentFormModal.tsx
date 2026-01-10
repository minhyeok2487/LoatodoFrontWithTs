import type { FC } from "react";
import { useState } from "react";
import styled from "styled-components";
import { MdClose } from "@react-icons/all-files/md/MdClose";

import Button from "@components/Button";

type Category =
  | "카오스던전"
  | "가디언토벌"
  | "군단장레이드"
  | "어비스던전"
  | "어비스레이드"
  | "에포나의뢰";

interface ContentData {
  contentId: number;
  category: Category;
  name: string;
  minItemLevel: number;
  weekContent: string;
  gold: number;
  sortNumber: number;
  isActive: boolean;
}

interface Props {
  mode: "create" | "edit";
  content: ContentData | null;
  categories: Category[];
  onClose: () => void;
}

const ContentFormModal: FC<Props> = ({ mode, content, categories, onClose }) => {
  const [formData, setFormData] = useState({
    category: content?.category || categories[0],
    name: content?.name || "",
    minItemLevel: content?.minItemLevel || 0,
    weekContent: content?.weekContent || "일일",
    gold: content?.gold || 0,
    sortNumber: content?.sortNumber || 1,
    isActive: content?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("콘텐츠명을 입력해주세요.");
      return;
    }
    // TODO: API 호출
    alert(`${mode === "create" ? "생성" : "수정"}되었습니다. (목업)`);
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {mode === "create" ? "콘텐츠 추가" : "콘텐츠 수정"}
          </ModalTitle>
          <CloseButton type="button" onClick={onClose}>
            <MdClose size={24} />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label>카테고리 *</Label>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as Category })
                }
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>콘텐츠명 *</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 카멘 하드"
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label>최소 아이템 레벨</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.minItemLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minItemLevel: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>골드 보상</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.gold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gold: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>주기</Label>
                <Select
                  value={formData.weekContent}
                  onChange={(e) =>
                    setFormData({ ...formData, weekContent: e.target.value })
                  }
                >
                  <option value="일일">일일</option>
                  <option value="주간">주간</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>정렬 순서</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.sortNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortNumber: parseInt(e.target.value, 10) || 1,
                    })
                  }
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>상태</Label>
              <ToggleWrapper>
                <ToggleButton
                  type="button"
                  $active={formData.isActive}
                  onClick={() => setFormData({ ...formData, isActive: true })}
                >
                  활성
                </ToggleButton>
                <ToggleButton
                  type="button"
                  $active={!formData.isActive}
                  onClick={() => setFormData({ ...formData, isActive: false })}
                >
                  비활성
                </ToggleButton>
              </ToggleWrapper>
              <HelpText>
                비활성 상태의 콘텐츠는 사용자에게 표시되지 않습니다.
              </HelpText>
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="outlined" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" variant="contained">
              {mode === "create" ? "추가" : "저장"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default ContentFormModal;

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
  max-width: 500px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const Input = styled.input`
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  font-size: 14px;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light2};
  }
`;

const Select = styled.select`
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
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

const ToggleWrapper = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  overflow: hidden;
  width: fit-content;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active }) =>
    $active ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent"};
  color: ${({ $active, theme }) => ($active ? "white" : theme.app.text.main)};

  &:hover {
    background: ${({ $active, theme }) =>
      $active
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        : theme.app.bg.gray1};
  }
`;

const HelpText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
  margin-top: 4px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.gray1};
`;
