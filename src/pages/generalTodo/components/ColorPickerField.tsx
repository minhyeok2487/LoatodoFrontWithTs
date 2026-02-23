import styled from "styled-components";

import { FormField, FormFieldLabel } from "@components/form/FormPrimitives";

export const COLOR_PALETTE = [
  "#F87171",
  "#FB923C",
  "#FACC15",
  "#34D399",
  "#60A5FA",
  "#A78BFA",
  "#F472B6",
];
export const DEFAULT_PICKER_COLOR = "#C5C6D0";

interface ColorPickerFieldProps {
  normalizedColor: string | null;
  onColorChange: (color: string | null) => void;
  disabled?: boolean;
  rawColor: string | null;
}

const ColorPickerField = ({
  normalizedColor,
  onColorChange,
  disabled,
  rawColor,
}: ColorPickerFieldProps) => {
  return (
    <FormField>
      <FormFieldLabel>표시 색상</FormFieldLabel>
      <ColorStatus>현재 선택: {normalizedColor ?? "없음"}</ColorStatus>
      <ColorSwatches>
        {COLOR_PALETTE.map((swatch) => (
          <ColorSwatchButton
            key={swatch}
            type="button"
            $color={swatch}
            $active={normalizedColor === swatch}
            onClick={() => onColorChange(swatch)}
            disabled={disabled}
            aria-label={`${swatch} 색상 선택`}
          />
        ))}
        <ClearColorButton
          type="button"
          onClick={() => onColorChange(null)}
          disabled={disabled}
        >
          색상 없음
        </ClearColorButton>
      </ColorSwatches>
      <ColorPickerRow>
        <ColorInput
          type="color"
          value={normalizedColor ?? DEFAULT_PICKER_COLOR}
          onChange={(event) => onColorChange(event.target.value.toUpperCase())}
          disabled={disabled}
          aria-label="카테고리 색상 선택"
          $isEmpty={!normalizedColor}
        />
        <ColorHexInput
          value={rawColor ?? ""}
          onChange={(event) => {
            const raw = event.target.value.toUpperCase();
            const sanitized = raw.replace(/[^0-9A-F#]/g, "");
            if (!sanitized.replace("#", "")) {
              onColorChange(null);
              return;
            }
            const prefixed = sanitized.startsWith("#")
              ? `#${sanitized.slice(1, 7)}`
              : `#${sanitized.slice(0, 6)}`;
            onColorChange(prefixed);
          }}
          disabled={disabled}
          maxLength={7}
          placeholder="#FFFFFF"
        />
      </ColorPickerRow>
    </FormField>
  );
};

export default ColorPickerField;

const ColorPickerRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ColorSwatches = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ColorSwatchButton = styled.button<{ $color: string; $active: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 2px solid
    ${({ theme, $active }) =>
      $active ? theme.app.text.dark1 : theme.app.border};
  background: ${({ $color }) => $color};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ClearColorButton = styled.button`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 6px;
  padding: 4px 8px;
  background: transparent;
  font-size: 12px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ColorInput = styled.input<{ $isEmpty: boolean }>`
  width: 44px;
  height: 44px;
  border: none;
  padding: 0;
  background: ${({ $isEmpty }) =>
    $isEmpty
      ? "repeating-linear-gradient(45deg, #d1d5db 0, #d1d5db 4px, transparent 4px, transparent 8px)"
      : "transparent"};
  cursor: pointer;
`;

const ColorHexInput = styled.input`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.dark1};
  background: ${({ theme }) => theme.app.bg.white};
`;

const ColorStatus = styled.p`
  margin: 4px 0;
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light1};
`;
