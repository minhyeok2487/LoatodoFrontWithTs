import type { FC } from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { toast } from "react-toastify";

import Button from "@components/Button";
import type {
  AdminContent,
  ContentType,
  ContentCategory,
  WeekContentCategory,
  AdminContentCreateRequest,
} from "@core/types/admin";
import { useCreateContent, useUpdateContent } from "../hooks/useContents";

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "day", label: "일일" },
  { value: "week", label: "주간" },
  { value: "cube", label: "큐브" },
];

const CATEGORIES: ContentCategory[] = [
  "카오스던전",
  "가디언토벌",
  "일일에포나",
  "군단장레이드",
  "어비스던전",
  "어비스레이드",
  "에브니큐브",
];

const WEEK_CONTENT_CATEGORIES: WeekContentCategory[] = [
  "노말",
  "하드",
  "싱글",
  "나이트메어",
];

interface Props {
  mode: "create" | "edit";
  content: AdminContent | null;
  onClose: () => void;
}

const ContentFormModal: FC<Props> = ({ mode, content, onClose }) => {
  const createContent = useCreateContent();
  const updateContent = useUpdateContent();

  const [contentType, setContentType] = useState<ContentType>(
    content?.contentType || "day"
  );

  const [formData, setFormData] = useState({
    name: "",
    level: 0,
    category: "카오스던전" as ContentCategory,
    // Day content fields
    shilling: 0,
    honorShard: 0,
    leapStone: 0,
    destructionStone: 0,
    guardianStone: 0,
    jewelry: 0,
    // Week content fields
    weekCategory: "",
    weekContentCategory: "노말" as WeekContentCategory,
    gate: 1,
    gold: 0,
    characterGold: 0,
    coolTime: 0,
    moreRewardGold: 0,
    // Cube content fields
    solarGrace: 0,
    solarBlessing: 0,
    solarProtection: 0,
    cardExp: 0,
    lavasBreath: 0,
    glaciersBreath: 0,
  });

  useEffect(() => {
    if (content) {
      setContentType(content.contentType);
      setFormData({
        name: content.name,
        level: content.level,
        category: content.category,
        // Day content fields
        shilling: content.contentType === "day" ? (content as any).shilling || 0 : 0,
        honorShard: content.contentType === "day" ? (content as any).honorShard || 0 : 0,
        leapStone: content.contentType === "day" || content.contentType === "cube" ? (content as any).leapStone || 0 : 0,
        destructionStone: content.contentType === "day" ? (content as any).destructionStone || 0 : 0,
        guardianStone: content.contentType === "day" ? (content as any).guardianStone || 0 : 0,
        jewelry: content.contentType === "day" || content.contentType === "cube" ? (content as any).jewelry || 0 : 0,
        // Week content fields
        weekCategory: content.contentType === "week" ? (content as any).weekCategory || "" : "",
        weekContentCategory: content.contentType === "week" ? (content as any).weekContentCategory || "노말" : "노말",
        gate: content.contentType === "week" ? (content as any).gate || 1 : 1,
        gold: content.contentType === "week" ? (content as any).gold || 0 : 0,
        characterGold: content.contentType === "week" ? (content as any).characterGold || 0 : 0,
        coolTime: content.contentType === "week" ? (content as any).coolTime || 0 : 0,
        moreRewardGold: content.contentType === "week" ? (content as any).moreRewardGold || 0 : 0,
        // Cube content fields
        solarGrace: content.contentType === "cube" ? (content as any).solarGrace || 0 : 0,
        solarBlessing: content.contentType === "cube" ? (content as any).solarBlessing || 0 : 0,
        solarProtection: content.contentType === "cube" ? (content as any).solarProtection || 0 : 0,
        cardExp: content.contentType === "cube" ? (content as any).cardExp || 0 : 0,
        lavasBreath: content.contentType === "cube" ? (content as any).lavasBreath || 0 : 0,
        glaciersBreath: content.contentType === "cube" ? (content as any).glaciersBreath || 0 : 0,
      });
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("콘텐츠명을 입력해주세요.");
      return;
    }

    let requestData: AdminContentCreateRequest;

    if (contentType === "day") {
      requestData = {
        contentType: "day",
        name: formData.name,
        level: formData.level,
        category: formData.category,
        shilling: formData.shilling || undefined,
        honorShard: formData.honorShard || undefined,
        leapStone: formData.leapStone || undefined,
        destructionStone: formData.destructionStone || undefined,
        guardianStone: formData.guardianStone || undefined,
        jewelry: formData.jewelry || undefined,
      };
    } else if (contentType === "week") {
      requestData = {
        contentType: "week",
        name: formData.name,
        level: formData.level,
        category: formData.category,
        weekCategory: formData.weekCategory,
        weekContentCategory: formData.weekContentCategory,
        gate: formData.gate,
        gold: formData.gold || undefined,
        characterGold: formData.characterGold || undefined,
        coolTime: formData.coolTime || undefined,
        moreRewardGold: formData.moreRewardGold || undefined,
      };
    } else {
      requestData = {
        contentType: "cube",
        name: formData.name,
        level: formData.level,
        category: formData.category,
        jewelry: formData.jewelry || undefined,
        leapStone: formData.leapStone || undefined,
        shilling: formData.shilling || undefined,
        solarGrace: formData.solarGrace || undefined,
        solarBlessing: formData.solarBlessing || undefined,
        solarProtection: formData.solarProtection || undefined,
        cardExp: formData.cardExp || undefined,
        lavasBreath: formData.lavasBreath || undefined,
        glaciersBreath: formData.glaciersBreath || undefined,
      };
    }

    try {
      if (mode === "create") {
        await createContent.mutateAsync(requestData);
        toast.success("콘텐츠가 추가되었습니다.");
      } else if (content) {
        await updateContent.mutateAsync({
          contentId: content.id,
          data: requestData,
        });
        toast.success("콘텐츠가 수정되었습니다.");
      }
      onClose();
    } catch {
      // 에러는 axios interceptor에서 처리됨
    }
  };

  const isPending = createContent.isPending || updateContent.isPending;

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
              <Label>콘텐츠 타입 *</Label>
              <Select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                disabled={mode === "edit"}
              >
                {CONTENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>카테고리 *</Label>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as ContentCategory })
                }
              >
                {CATEGORIES.map((cat) => (
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
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      level: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </FormGroup>
            </FormRow>

            {contentType === "day" && (
              <>
                <SectionTitle>일일 콘텐츠 보상</SectionTitle>
                <FormRow>
                  <FormGroup>
                    <Label>실링</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.shilling}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shilling: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>명예의 파편</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.honorShard}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          honorShard: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <Label>돌파석</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.leapStone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          leapStone: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>파괴석</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.destructionStone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          destructionStone: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <Label>수호석</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.guardianStone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          guardianStone: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>보석</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.jewelry}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jewelry: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                </FormRow>
              </>
            )}

            {contentType === "week" && (
              <>
                <SectionTitle>주간 콘텐츠 설정</SectionTitle>
                <FormRow>
                  <FormGroup>
                    <Label>주간 카테고리</Label>
                    <Input
                      type="text"
                      value={formData.weekCategory}
                      onChange={(e) =>
                        setFormData({ ...formData, weekCategory: e.target.value })
                      }
                      placeholder="예: 카멘"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>난이도</Label>
                    <Select
                      value={formData.weekContentCategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weekContentCategory: e.target.value as WeekContentCategory,
                        })
                      }
                    >
                      {WEEK_CONTENT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <Label>관문</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.gate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gate: parseInt(e.target.value, 10) || 1,
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
                    <Label>캐릭터 골드</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.characterGold}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          characterGold: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>더보기 골드</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.moreRewardGold}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          moreRewardGold: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                </FormRow>
                <FormGroup>
                  <Label>쿨타임 (주)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.coolTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coolTime: parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                </FormGroup>
              </>
            )}

            {contentType === "cube" && (
              <>
                <SectionTitle>큐브 콘텐츠 보상</SectionTitle>
                <FormRow>
                  <FormGroup>
                    <Label>실링</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.shilling}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shilling: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>보석</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.jewelry}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jewelry: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <Label>돌파석</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.leapStone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          leapStone: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>카드 경험치</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.cardExp}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cardExp: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <Label>태양의 은총</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.solarGrace}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          solarGrace: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>태양의 축복</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.solarBlessing}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          solarBlessing: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <Label>태양의 가호</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.solarProtection}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          solarProtection: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <Label>용암의 숨결</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.lavasBreath}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lavasBreath: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>빙하의 숨결</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.glaciersBreath}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          glaciersBreath: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormGroup>
                </FormRow>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="outlined" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" variant="contained" disabled={isPending}>
              {isPending ? "저장 중..." : mode === "create" ? "추가" : "저장"}
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
  gap: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 8px 0 0 0;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
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

  &:disabled {
    background: ${({ theme }) => theme.app.bg.gray1};
    cursor: not-allowed;
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

  &:disabled {
    background: ${({ theme }) => theme.app.bg.gray1};
    cursor: not-allowed;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.gray1};
`;
