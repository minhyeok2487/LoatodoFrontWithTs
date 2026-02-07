import type { FC } from "react";

import Select from "@components/form/Select";
import type { WeekContentDifficulty } from "@core/types/admin";

import { SectionTitle, FormGroup, FormRow, Label, Input } from "./ContentForm.styles";

const WEEK_DIFFICULTIES: WeekContentDifficulty[] = ["노말", "하드", "싱글", "나이트메어"];

interface WeekFormData {
  weekCategory: string;
  weekContentCategory: WeekContentDifficulty;
  gate: number;
  coolTime: number;
  honorShard: number;
  leapStone: number;
  destructionStone: number;
  guardianStone: number;
  gold: number;
  characterGold: number;
  moreRewardGold: number;
}

interface Props {
  formData: WeekFormData;
  onChange: (field: keyof WeekFormData, value: string | number) => void;
}

const WeekContentForm: FC<Props> = ({ formData, onChange }) => {
  const handleNumberChange = (field: keyof WeekFormData, isFloat = false) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = isFloat
        ? parseFloat(e.target.value) || 0
        : parseInt(e.target.value, 10) || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange(field, value as any);
    };

  return (
    <>
      <SectionTitle>주간 콘텐츠 설정</SectionTitle>
      <FormRow>
        <FormGroup>
          <Label>레이드 이름</Label>
          <Input
            type="text"
            value={formData.weekCategory}
            onChange={(e) => onChange("weekCategory", e.target.value)}
            placeholder="예: 카멘"
          />
        </FormGroup>
        <FormGroup>
          <Label>난이도</Label>
          <Select
            value={formData.weekContentCategory}
            onChange={(value) => onChange("weekContentCategory", value as WeekContentDifficulty)}
            options={WEEK_DIFFICULTIES.map((d) => ({ value: d, label: d }))}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <Label>관문</Label>
          <Input
            type="number"
            min="1"
            value={formData.gate}
            onChange={handleNumberChange("gate")}
          />
        </FormGroup>
        <FormGroup>
          <Label>쿨타임 (주)</Label>
          <Input
            type="number"
            min="0"
            value={formData.coolTime}
            onChange={handleNumberChange("coolTime")}
          />
        </FormGroup>
      </FormRow>

      <SectionTitle>보상</SectionTitle>
      <FormRow>
        <FormGroup>
          <Label>명예의 파편</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.honorShard}
            onChange={handleNumberChange("honorShard", true)}
          />
        </FormGroup>
        <FormGroup>
          <Label>돌파석</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.leapStone}
            onChange={handleNumberChange("leapStone", true)}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <Label>파괴석</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.destructionStone}
            onChange={handleNumberChange("destructionStone", true)}
          />
        </FormGroup>
        <FormGroup>
          <Label>수호석</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.guardianStone}
            onChange={handleNumberChange("guardianStone", true)}
          />
        </FormGroup>
      </FormRow>

      <SectionTitle>골드</SectionTitle>
      <FormRow>
        <FormGroup>
          <Label>클리어 골드</Label>
          <Input
            type="number"
            min="0"
            value={formData.gold}
            onChange={handleNumberChange("gold")}
          />
        </FormGroup>
        <FormGroup>
          <Label>캐릭터 귀속 골드</Label>
          <Input
            type="number"
            min="0"
            value={formData.characterGold}
            onChange={handleNumberChange("characterGold")}
          />
        </FormGroup>
      </FormRow>
      <FormGroup>
        <Label>더보기 골드</Label>
        <Input
          type="number"
          min="0"
          value={formData.moreRewardGold}
          onChange={handleNumberChange("moreRewardGold")}
        />
      </FormGroup>
    </>
  );
};

export default WeekContentForm;
