import type { FC } from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { toast } from "react-toastify";

import Button from "@components/Button";
import Select from "@components/form/Select";
import type {
  AdminContent,
  ContentCategory,
  DayContentCategory,
  WeekContentCategory as WeekCategory,
  CubeContentCategory,
  WeekContentDifficulty,
  AdminContentCreateRequest,
} from "@core/types/admin";
import { useCreateContent, useUpdateContent } from "../hooks/useContents";
import { DayContentForm, WeekContentForm, CubeContentForm, FormGroup, Label, Input } from "./form";

const DAY_CATEGORIES: DayContentCategory[] = ["카오스던전", "가디언토벌", "일일에포나"];
const WEEK_CATEGORIES: WeekCategory[] = ["군단장레이드", "어비스던전", "어비스레이드"];
const CUBE_CATEGORIES: CubeContentCategory[] = ["에브니큐브"];

const ALL_CATEGORIES: ContentCategory[] = [
  ...DAY_CATEGORIES,
  ...WEEK_CATEGORIES,
  ...CUBE_CATEGORIES,
];

const getContentType = (category: ContentCategory): "day" | "week" | "cube" => {
  if (DAY_CATEGORIES.includes(category as DayContentCategory)) return "day";
  if (WEEK_CATEGORIES.includes(category as WeekCategory)) return "week";
  return "cube";
};

const getContentTypeLabel = (type: "day" | "week" | "cube") => {
  switch (type) {
    case "day":
      return "일일";
    case "week":
      return "주간";
    case "cube":
      return "큐브";
    default:
      return "알수없음";
  }
};

interface Props {
  mode: "create" | "edit";
  content: AdminContent | null;
  onClose: () => void;
}

interface FormData {
  name: string;
  level: number;
  category: ContentCategory;
  shilling: number;
  honorShard: number;
  leapStone: number;
  destructionStone: number;
  guardianStone: number;
  jewelry: number;
  weekCategory: string;
  weekContentCategory: WeekContentDifficulty;
  gate: number;
  gold: number;
  characterGold: number;
  coolTime: number;
  moreRewardGold: number;
  solarGrace: number;
  solarBlessing: number;
  solarProtection: number;
  cardExp: number;
  lavasBreath: number;
  glaciersBreath: number;
}

const initialFormData: FormData = {
  name: "",
  level: 0,
  category: "카오스던전",
  shilling: 0,
  honorShard: 0,
  leapStone: 0,
  destructionStone: 0,
  guardianStone: 0,
  jewelry: 0,
  weekCategory: "",
  weekContentCategory: "노말",
  gate: 1,
  gold: 0,
  characterGold: 0,
  coolTime: 0,
  moreRewardGold: 0,
  solarGrace: 0,
  solarBlessing: 0,
  solarProtection: 0,
  cardExp: 0,
  lavasBreath: 0,
  glaciersBreath: 0,
};

const ContentFormModal: FC<Props> = ({ mode, content, onClose }) => {
  const createContent = useCreateContent();
  const updateContent = useUpdateContent();
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    if (content) {
      const contentType = getContentType(content.category);
      const c = content as any;
      setFormData({
        name: content.name,
        level: content.level,
        category: content.category,
        shilling: contentType === "day" || contentType === "cube" ? c.shilling || 0 : 0,
        honorShard: contentType !== "cube" ? c.honorShard || 0 : 0,
        leapStone: c.leapStone || 0,
        destructionStone: contentType !== "cube" ? c.destructionStone || 0 : 0,
        guardianStone: contentType !== "cube" ? c.guardianStone || 0 : 0,
        jewelry: contentType !== "week" ? c.jewelry || 0 : 0,
        weekCategory: contentType === "week" ? c.weekCategory || "" : "",
        weekContentCategory: contentType === "week" ? c.weekContentCategory || "노말" : "노말",
        gate: contentType === "week" ? c.gate || 1 : 1,
        gold: contentType === "week" ? c.gold || 0 : 0,
        characterGold: contentType === "week" ? c.characterGold || 0 : 0,
        coolTime: contentType === "week" ? c.coolTime || 0 : 0,
        moreRewardGold: contentType === "week" ? c.moreRewardGold || 0 : 0,
        solarGrace: contentType === "cube" ? c.solarGrace || 0 : 0,
        solarBlessing: contentType === "cube" ? c.solarBlessing || 0 : 0,
        solarProtection: contentType === "cube" ? c.solarProtection || 0 : 0,
        cardExp: contentType === "cube" ? c.cardExp || 0 : 0,
        lavasBreath: contentType === "cube" ? c.lavasBreath || 0 : 0,
        glaciersBreath: contentType === "cube" ? c.glaciersBreath || 0 : 0,
      });
    }
  }, [content]);

  const contentType = getContentType(formData.category);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("콘텐츠명을 입력해주세요.");
      return;
    }

    let requestData: AdminContentCreateRequest;

    if (contentType === "day") {
      requestData = {
        name: formData.name,
        level: formData.level,
        category: formData.category as DayContentCategory,
        shilling: formData.shilling || undefined,
        honorShard: formData.honorShard || undefined,
        leapStone: formData.leapStone || undefined,
        destructionStone: formData.destructionStone || undefined,
        guardianStone: formData.guardianStone || undefined,
        jewelry: formData.jewelry || undefined,
      };
    } else if (contentType === "week") {
      requestData = {
        name: formData.name,
        level: formData.level,
        category: formData.category as WeekCategory,
        weekCategory: formData.weekCategory,
        weekContentCategory: formData.weekContentCategory,
        gate: formData.gate,
        honorShard: formData.honorShard || undefined,
        leapStone: formData.leapStone || undefined,
        destructionStone: formData.destructionStone || undefined,
        guardianStone: formData.guardianStone || undefined,
        gold: formData.gold || undefined,
        characterGold: formData.characterGold || undefined,
        coolTime: formData.coolTime || undefined,
        moreRewardGold: formData.moreRewardGold || undefined,
      };
    } else {
      requestData = {
        name: formData.name,
        level: formData.level,
        category: formData.category as CubeContentCategory,
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
              <Label>카테고리 *</Label>
              <Select
                value={formData.category}
                onChange={(value) => updateField("category", value as ContentCategory)}
                options={ALL_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
              />
              <TypeBadge $type={contentType}>
                {getContentTypeLabel(contentType)} 콘텐츠
              </TypeBadge>
            </FormGroup>

            <FormGroup>
              <Label>콘텐츠명 *</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="예: 카멘 하드"
              />
            </FormGroup>

            <FormGroup>
              <Label>입장 레벨</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.level}
                onChange={(e) => updateField("level", parseFloat(e.target.value) || 0)}
              />
            </FormGroup>

            {contentType === "day" && (
              <DayContentForm
                formData={formData}
                onChange={(field, value) => updateField(field, value)}
              />
            )}

            {contentType === "week" && (
              <WeekContentForm
                formData={formData}
                onChange={(field, value) => updateField(field, value)}
              />
            )}

            {contentType === "cube" && (
              <CubeContentForm
                formData={formData}
                onChange={(field, value) => updateField(field, value)}
              />
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

const TypeBadge = styled.span<{ $type: "day" | "week" | "cube" }>`
  display: inline-flex;
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
  background: ${({ $type }) =>
    $type === "day" ? "#dbeafe" : $type === "week" ? "#fee2e2" : "#fef3c7"};
  color: ${({ $type }) =>
    $type === "day" ? "#1e40af" : $type === "week" ? "#991b1b" : "#92400e"};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.gray1};
`;
