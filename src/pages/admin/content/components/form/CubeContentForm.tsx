import type { FC } from "react";

import { SectionTitle, FormGroup, FormRow, Label, Input } from "./ContentForm.styles";

interface CubeFormData {
  shilling: number;
  jewelry: number;
  leapStone: number;
  cardExp: number;
  solarGrace: number;
  solarBlessing: number;
  solarProtection: number;
  lavasBreath: number;
  glaciersBreath: number;
}

interface Props {
  formData: CubeFormData;
  onChange: (field: keyof CubeFormData, value: number) => void;
}

const CubeContentForm: FC<Props> = ({ formData, onChange }) => {
  const handleChange = (field: keyof CubeFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field, parseFloat(e.target.value) || 0);
  };

  return (
    <>
      <SectionTitle>큐브 콘텐츠 보상</SectionTitle>
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
          <Label>카드 경험치</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.cardExp}
            onChange={handleChange("cardExp")}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <Label>태양의 은총</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.solarGrace}
            onChange={handleChange("solarGrace")}
          />
        </FormGroup>
        <FormGroup>
          <Label>태양의 축복</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.solarBlessing}
            onChange={handleChange("solarBlessing")}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <Label>태양의 가호</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.solarProtection}
            onChange={handleChange("solarProtection")}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <Label>용암의 숨결</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.lavasBreath}
            onChange={handleChange("lavasBreath")}
          />
        </FormGroup>
        <FormGroup>
          <Label>빙하의 숨결</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.glaciersBreath}
            onChange={handleChange("glaciersBreath")}
          />
        </FormGroup>
      </FormRow>
    </>
  );
};

export default CubeContentForm;
