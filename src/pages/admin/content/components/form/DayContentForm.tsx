import type { FC } from "react";

import { SectionTitle, FormGroup, FormRow, Label, Input } from "./ContentForm.styles";

interface DayFormData {
  shilling: number;
  honorShard: number;
  leapStone: number;
  destructionStone: number;
  guardianStone: number;
  jewelry: number;
}

interface Props {
  formData: DayFormData;
  onChange: (field: keyof DayFormData, value: number) => void;
}

const DayContentForm: FC<Props> = ({ formData, onChange }) => {
  const handleChange = (field: keyof DayFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field, parseFloat(e.target.value) || 0);
  };

  return (
    <>
      <SectionTitle>일일 콘텐츠 보상</SectionTitle>
      <FormRow>
        <FormGroup>
          <Label>실링</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.shilling}
            onChange={handleChange("shilling")}
          />
        </FormGroup>
        <FormGroup>
          <Label>명예의 파편</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.honorShard}
            onChange={handleChange("honorShard")}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <Label>돌파석</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.leapStone}
            onChange={handleChange("leapStone")}
          />
        </FormGroup>
        <FormGroup>
          <Label>파괴석</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.destructionStone}
            onChange={handleChange("destructionStone")}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <Label>수호석</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.guardianStone}
            onChange={handleChange("guardianStone")}
          />
        </FormGroup>
        <FormGroup>
          <Label>1레벨 보석</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.jewelry}
            onChange={handleChange("jewelry")}
          />
        </FormGroup>
      </FormRow>
    </>
  );
};

export default DayContentForm;
